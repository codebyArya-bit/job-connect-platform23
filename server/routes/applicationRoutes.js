const express = require('express');
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getApplicationById,
  withdrawApplication
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes - Job Seekers
router.post('/apply/:jobId', protect, authorize('job_seeker'), applyForJob);
router.get('/my', protect, authorize('job_seeker'), getMyApplications);
router.put('/withdraw/:applicationId', protect, authorize('job_seeker'), withdrawApplication);

// Protected routes - Recruiters
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplications);
router.put('/status/:applicationId', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

// Protected routes - Both roles
router.get('/:applicationId', protect, getApplicationById);

module.exports = router;