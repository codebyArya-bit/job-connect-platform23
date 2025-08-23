const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// In-memory user helpers
class InMemoryUser {
  constructor(userData) {
    this.id = uuidv4();
    this._id = this.id;
    this.username = userData.username;
    this.email = userData.email;
    this.password = userData.password;
    this.role = userData.role || 'job_seeker';
    this.profile = userData.profile || {};
    this.isActive = true;
    this.createdAt = new Date();
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}

// In-memory database operations
const inMemoryOperations = {
  // User operations
  async createUser(userData) {
    if (!global.useInMemoryDB) return null;
    
    // Hash password
    userData.password = await InMemoryUser.hashPassword(userData.password);
    
    const user = new InMemoryUser(userData);
    global.inMemoryDB.users.push(user);
    return user;
  },

  async findUserByEmail(email) {
    if (!global.useInMemoryDB) return null;
    return global.inMemoryDB.users.find(user => user.email === email);
  },

  async findUserByUsername(username) {
    if (!global.useInMemoryDB) return null;
    return global.inMemoryDB.users.find(user => user.username === username);
  },

  async findUserById(id) {
    if (!global.useInMemoryDB) return null;
    return global.inMemoryDB.users.find(user => user.id === id || user._id === id);
  },

  async findUserByEmailOrUsername(email, username) {
    if (!global.useInMemoryDB) return null;
    return global.inMemoryDB.users.find(user => 
      user.email === email || user.username === username
    );
  },

  async updateUser(id, updateData) {
    if (!global.useInMemoryDB) return null;
    const userIndex = global.inMemoryDB.users.findIndex(user => user.id === id || user._id === id);
    if (userIndex !== -1) {
      Object.assign(global.inMemoryDB.users[userIndex], updateData);
      return global.inMemoryDB.users[userIndex];
    }
    return null;
  },

  async deleteUser(id) {
    if (!global.useInMemoryDB) return null;
    const userIndex = global.inMemoryDB.users.findIndex(user => user.id === id || user._id === id);
    if (userIndex !== -1) {
      return global.inMemoryDB.users.splice(userIndex, 1)[0];
    }
    return null;
  },

  // Job operations
  async createJob(jobData) {
    if (!global.useInMemoryDB) return null;
    
    const job = {
      id: uuidv4(),
      _id: uuidv4(),
      ...jobData,
      status: 'active',
      applicationCount: 0,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    global.inMemoryDB.jobs.push(job);
    return job;
  },

  async findJobs(filters = {}) {
    if (!global.useInMemoryDB) return [];
    
    let jobs = [...global.inMemoryDB.jobs];
    
    // Apply filters
    if (filters.search) {
      jobs = jobs.filter(job => 
        job.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.location) {
      jobs = jobs.filter(job => 
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.jobType) {
      jobs = jobs.filter(job => job.jobType === filters.jobType);
    }

    if (filters.postedBy) {
      jobs = jobs.filter(job => job.postedBy === filters.postedBy);
    }

    if (filters.status) {
      jobs = jobs.filter(job => job.status === filters.status);
    }
    
    return jobs;
  },

  async findJobById(id) {
    if (!global.useInMemoryDB) return null;
    return global.inMemoryDB.jobs.find(job => job.id === id || job._id === id);
  },

  async updateJob(id, updateData) {
    if (!global.useInMemoryDB) return null;
    const jobIndex = global.inMemoryDB.jobs.findIndex(job => job.id === id || job._id === id);
    if (jobIndex !== -1) {
      Object.assign(global.inMemoryDB.jobs[jobIndex], updateData, { updatedAt: new Date() });
      return global.inMemoryDB.jobs[jobIndex];
    }
    return null;
  },

  async deleteJob(id) {
    if (!global.useInMemoryDB) return null;
    const jobIndex = global.inMemoryDB.jobs.findIndex(job => job.id === id || job._id === id);
    if (jobIndex !== -1) {
      return global.inMemoryDB.jobs.splice(jobIndex, 1)[0];
    }
    return null;
  },

  // Application operations
  async createApplication(applicationData) {
    if (!global.useInMemoryDB) return null;
    
    const application = {
      id: uuidv4(),
      _id: uuidv4(),
      ...applicationData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    global.inMemoryDB.applications.push(application);
    return application;
  },

  async findApplicationsByUser(userId) {
    if (!global.useInMemoryDB) return [];
    return global.inMemoryDB.applications.filter(app => app.userId === userId);
  },

  async findApplicationsByJob(jobId) {
    if (!global.useInMemoryDB) return [];
    return global.inMemoryDB.applications.filter(app => app.jobId === jobId);
  },

  async findApplicationById(id) {
    if (!global.useInMemoryDB) return null;
    return global.inMemoryDB.applications.find(app => app.id === id || app._id === id);
  },

  async updateApplication(id, updateData) {
    if (!global.useInMemoryDB) return null;
    const appIndex = global.inMemoryDB.applications.findIndex(app => app.id === id || app._id === id);
    if (appIndex !== -1) {
      Object.assign(global.inMemoryDB.applications[appIndex], updateData, { updatedAt: new Date() });
      return global.inMemoryDB.applications[appIndex];
    }
    return null;
  }
};

module.exports = {
  InMemoryUser,
  inMemoryOperations
};