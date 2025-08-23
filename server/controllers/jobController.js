const Job = require('../models/Job');
const { inMemoryOperations } = require('../utils/inMemoryHelpers');

// Get all jobs with filtering and pagination
const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      jobType,
      workMode,
      experienceLevel,
      minSalary,
      maxSalary,
      skills
    } = req.query;

    // Mock job data for demonstration (since no database connection)
    const mockJobs = [
      {
        _id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        jobType: 'full-time',
        workMode: 'remote',
        experienceLevel: 'senior',
        salaryMin: 120000,
        salaryMax: 160000,
        skills: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
        description: 'We are looking for a senior frontend developer to join our team.',
        requirements: ['5+ years of React experience', 'Strong JavaScript skills'],
        benefits: ['Health insurance', 'Remote work', '401k matching'],
        status: 'active',
        createdAt: new Date('2024-01-15'),
        postedBy: {
          _id: 'user1',
          name: 'John Smith',
          email: 'john.smith@techcorp.com',
          role: 'recruiter',
          company: 'TechCorp Inc.'
        }
      },
      {
        _id: '2',
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'New York, NY',
        jobType: 'full-time',
        workMode: 'hybrid',
        experienceLevel: 'mid',
        salaryMin: 90000,
        salaryMax: 120000,
        skills: ['React', 'Node.js', 'MongoDB', 'Express'],
        description: 'Join our growing startup as a full stack developer.',
        requirements: ['3+ years of full stack experience', 'MERN stack knowledge'],
        benefits: ['Equity options', 'Flexible hours', 'Health insurance'],
        status: 'active',
        createdAt: new Date('2024-01-14'),
        postedBy: {
          _id: 'user2',
          name: 'Jane Doe',
          email: 'jane.doe@startupxyz.com',
          role: 'recruiter',
          company: 'StartupXYZ'
        }
      },
      {
        _id: '3',
        title: 'Backend Developer',
        company: 'Enterprise Solutions',
        location: 'Austin, TX',
        jobType: 'full-time',
        workMode: 'onsite',
        experienceLevel: 'junior',
        salaryMin: 70000,
        salaryMax: 90000,
        skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
        description: 'Entry-level backend developer position with growth opportunities.',
        requirements: ['1+ years of Python experience', 'Database knowledge'],
        benefits: ['Training programs', 'Health insurance', 'Paid time off'],
        status: 'active',
        createdAt: new Date('2024-01-13'),
        postedBy: {
          _id: 'user3',
          name: 'Mike Johnson',
          email: 'mike.johnson@enterprise.com',
          role: 'recruiter',
          company: 'Enterprise Solutions'
        }
      },
      {
        _id: '4',
        title: 'DevOps Engineer',
        company: 'CloudTech',
        location: 'Seattle, WA',
        jobType: 'contract',
        workMode: 'remote',
        experienceLevel: 'senior',
        salaryMin: 130000,
        salaryMax: 170000,
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
        description: 'Contract DevOps engineer for cloud infrastructure projects.',
        requirements: ['5+ years of DevOps experience', 'AWS certification preferred'],
        benefits: ['High hourly rate', 'Remote work', 'Flexible schedule'],
        status: 'active',
        createdAt: new Date('2024-01-12'),
        postedBy: {
          _id: 'user4',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@cloudtech.com',
          role: 'recruiter',
          company: 'CloudTech'
        }
      },
      {
        _id: '5',
        title: 'UI/UX Designer',
        company: 'Design Studio',
        location: 'Los Angeles, CA',
        jobType: 'part-time',
        workMode: 'hybrid',
        experienceLevel: 'mid',
        salaryMin: 60000,
        salaryMax: 80000,
        skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
        description: 'Part-time UI/UX designer for creative projects.',
        requirements: ['3+ years of design experience', 'Portfolio required'],
        benefits: ['Creative freedom', 'Flexible hours', 'Health insurance'],
        status: 'active',
        createdAt: new Date('2024-01-11'),
        postedBy: {
          _id: 'user5',
          name: 'Alex Brown',
          email: 'alex.brown@designstudio.com',
          role: 'recruiter',
          company: 'Design Studio'
        }
      }
    ];

    // Apply basic filtering to mock data
    let filteredJobs = mockJobs.filter(job => {
      if (search && !job.title.toLowerCase().includes(search.toLowerCase()) && 
          !job.company.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (location && !job.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
      if (jobType && job.jobType !== jobType) {
        return false;
      }
      if (workMode && job.workMode !== workMode) {
        return false;
      }
      if (experienceLevel && job.experienceLevel !== experienceLevel) {
        return false;
      }
      if (minSalary && job.salaryMin < parseInt(minSalary)) {
        return false;
      }
      if (maxSalary && job.salaryMax > parseInt(maxSalary)) {
        return false;
      }
      return true;
    });

    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: paginatedJobs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(filteredJobs.length / parseInt(limit)),
        total: filteredJobs.length,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs'
    });
  }
};

// Get single job by ID
const getJobById = async (req, res) => {
  try {
    // Mock job data for demonstration
    const mockJobs = [
      {
        _id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 120000,
        salaryMax: 180000,
        description: 'We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for developing user-facing web applications using modern JavaScript frameworks.',
        requirements: ['5+ years React experience', 'TypeScript proficiency', 'CSS/SCSS expertise', 'Git version control'],
        skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
        benefits: ['Health insurance', 'Dental coverage', 'Flexible work hours', 'Remote work options'],
        applicationDeadline: new Date('2024-03-15'),
        viewCount: 45,
        postedBy: {
          _id: 'user1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@techcorp.com',
          role: 'recruiter',
          company: 'TechCorp Inc.'
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        _id: '2',
        title: 'Backend Developer',
        company: 'StartupXYZ',
        location: 'New York, NY',
        jobType: 'full-time',
        experienceLevel: 'mid-level',
        salaryMin: 90000,
        salaryMax: 130000,
        description: 'Join our growing startup as a Backend Developer. You will work on scalable server-side applications and APIs.',
        requirements: ['3+ years Node.js experience', 'Database design skills', 'API development', 'Cloud platforms'],
        skills: ['Node.js', 'MongoDB', 'Express', 'AWS'],
        benefits: ['Equity options', 'Health insurance', 'Learning budget', 'Flexible PTO'],
        applicationDeadline: new Date('2024-03-20'),
        viewCount: 32,
        postedBy: {
          _id: 'user2',
          name: 'Mike Chen',
          email: 'mike.chen@startupxyz.com',
          role: 'recruiter',
          company: 'StartupXYZ'
        },
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18')
      }
    ];

    const jobId = req.params.id;
    const job = mockJobs.find(job => job._id === jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { job }
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job'
    });
  }
};

// Create new job (Recruiter only)
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      requirements,
      location,
      jobType,
      workMode,
      experienceLevel,
      salary,
      skills,
      benefits,
      applicationDeadline,
      tags
    } = req.body;

    // Basic validation
    if (!title || !description || !requirements) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and requirements'
      });
    }

    let job;
    
    if (global.useInMemoryDB) {
      // Create job in memory
      job = await inMemoryOperations.createJob({
        title,
        company: typeof company === 'string' ? { name: company } : company,
        description,
        requirements,
        location,
        jobType: jobType || 'full-time',
        workMode: workMode || 'on-site',
        experienceLevel: experienceLevel || 'mid',
        salary,
        skills: skills || [],
        benefits: benefits || [],
        applicationDeadline,
        tags: tags || [],
        postedBy: req.user.id
      });
      
      // Add user info for response
      job.postedBy = {
        _id: req.user.id,
        username: req.user.username,
        profile: req.user.profile
      };
    } else {
      // Create job in MongoDB
      job = await Job.create({
        title,
        company,
        description,
        requirements,
        location,
        jobType,
        workMode,
        experienceLevel,
        salary,
        skills,
        benefits,
        applicationDeadline,
        tags,
        postedBy: req.user.id
      });

      // Populate the created job
      await job.populate('postedBy', 'username profile.firstName profile.lastName company');
    }

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: { job }
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating job'
    });
  }
};

// Update job (Owner or Admin only)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'username profile.firstName profile.lastName company');

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: { job: updatedJob }
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating job'
    });
  }
};

// Delete job (Owner or Admin only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting job'
    });
  }
};

// Get jobs posted by current user (Recruiter)
const getMyJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let jobs, total;
    
    if (global.useInMemoryDB) {
      // Get jobs from in-memory database
      const filter = { postedBy: req.user.id };
      if (status) {
        filter.status = status;
      }
      
      const allJobs = await inMemoryOperations.findJobs(filter);
      total = allJobs.length;
      
      // Apply pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      jobs = allJobs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(skip, skip + parseInt(limit));
    } else {
      // Get jobs from MongoDB
      const filter = { postedBy: req.user.id };
      if (status) {
        filter.status = status;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      jobs = await Job.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      total = await Job.countDocuments(filter);
    }

    res.status(200).json({
      success: true,
      data: {
        jobs,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your jobs'
    });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
};