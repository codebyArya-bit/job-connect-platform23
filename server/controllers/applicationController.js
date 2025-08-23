const Application = require('../models/Application');
const Job = require('../models/Job');
const { inMemoryOperations } = require('../utils/inMemoryHelpers');

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resumeUrl } = req.body;

    let job, existingApplication, application;

    if (global.useInMemoryDB) {
      // Check if job exists in memory
      job = await inMemoryOperations.findJobById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      // Check if job is still active
      if (job.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'This job is no longer accepting applications'
        });
      }

      // Check if application deadline has passed
      if (job.applicationDeadline && new Date() > job.applicationDeadline) {
        return res.status(400).json({
          success: false,
          message: 'Application deadline has passed'
        });
      }

      // Check if user already applied (simplified check for in-memory)
      const userApplications = await inMemoryOperations.findApplicationsByUser(req.user.id);
      existingApplication = userApplications.find(app => app.jobId === jobId);

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: 'You have already applied for this job'
        });
      }

      // Create application in memory
      application = await inMemoryOperations.createApplication({
        jobId: jobId,
        userId: req.user.id,
        coverLetter,
        resumeUrl: resumeUrl || req.user.profile?.resume,
        status: 'applied'
      });

      // Increment job application count
      await inMemoryOperations.updateJob(jobId, {
        applicationCount: (job.applicationCount || 0) + 1
      });

      // Add job and user details for response
      application.job = {
        title: job.title,
        company: job.company,
        location: job.location
      };
      application.applicant = {
        username: req.user.username,
        profile: req.user.profile
      };
    } else {
      // MongoDB operations
      job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      // Check if job is still active
      if (job.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'This job is no longer accepting applications'
        });
      }

      // Check if application deadline has passed
      if (job.applicationDeadline && new Date() > job.applicationDeadline) {
        return res.status(400).json({
          success: false,
          message: 'Application deadline has passed'
        });
      }

      // Check if user already applied
      existingApplication = await Application.findOne({
        job: jobId,
        applicant: req.user.id
      });

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: 'You have already applied for this job'
        });
      }

      // Create application
      application = await Application.create({
        job: jobId,
        applicant: req.user.id,
        coverLetter,
        resume: {
          url: resumeUrl || req.user.profile.resume,
          filename: 'resume.pdf'
        },
        source: 'website'
      });

      // Increment job application count
      job.applicationCount += 1;
      await job.save();

      // Populate the application
      await application.populate([
        { path: 'job', select: 'title company location' },
        { path: 'applicant', select: 'username profile.firstName profile.lastName profile.email' }
      ]);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting application'
    });
  }
};

// Get user's applications (Job Seeker)
const getMyApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Build filter
    const filter = { applicant: req.user.id };
    if (status) {
      filter['status.current'] = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(filter)
      .populate('job', 'title company location jobType workMode salary')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
};

// Get applications for a job (Recruiter)
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10, status, priority } = req.query;

    // Check if job exists and user owns it
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this job'
      });
    }

    // Build filter
    const filter = { job: jobId };
    if (status) {
      filter['status.current'] = status;
    }
    if (priority) {
      filter.priority = priority;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(filter)
      .populate('applicant', 'username profile.firstName profile.lastName profile.email profile.phone profile.location profile.skills profile.experience')
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        applications,
        job: {
          id: job._id,
          title: job.title,
          company: job.company
        },
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job applications'
    });
  }
};

// Update application status (Recruiter)
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes, interviewDetails, offerDetails } = req.body;

    const application = await Application.findById(applicationId)
      .populate('job', 'postedBy title company');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns the job
    if (application.job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update application
    application.status.current = status;
    application.status.history.push({
      status,
      changedBy: req.user.id,
      changedAt: new Date(),
      notes
    });

    if (notes) {
      application.recruiterNotes = notes;
    }

    if (interviewDetails) {
      application.interview = interviewDetails;
    }

    if (offerDetails) {
      application.offer = offerDetails;
    }

    await application.save();

    await application.populate('applicant', 'username profile.firstName profile.lastName profile.email');

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating application status'
    });
  }
};

// Get single application details
const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate('job', 'title company location jobType workMode salary description requirements')
      .populate('applicant', 'username profile')
      .populate('status.history.changedBy', 'username profile.firstName profile.lastName');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user can view this application
    const canView = application.applicant._id.toString() === req.user.id ||
                   application.job.postedBy?.toString() === req.user.id ||
                   req.user.role === 'admin';

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      data: { application }
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application'
    });
  }
};

// Withdraw application (Job Seeker)
const withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns the application
    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application'
      });
    }

    // Check if application can be withdrawn
    if (['accepted', 'rejected'].includes(application.status.current)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw application that has been accepted or rejected'
      });
    }

    // Update application status
    application.status.current = 'withdrawn';
    application.status.history.push({
      status: 'withdrawn',
      changedBy: req.user.id,
      changedAt: new Date(),
      notes: 'Application withdrawn by applicant'
    });
    application.isActive = false;

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while withdrawing application'
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getApplicationById,
  withdrawApplication
};