import Service from '../models/Service.js';

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    let services = await Service.find({ isActive: true });
    
    // Auto-seed the 9 services from the banner if DB is empty
    if (services.length === 0) {
      const defaultServices = [
        {
          title: 'Special Education',
          description: 'Tailored teaching programs designed for children with unique learning requirements to build foundational academic and cognitive skills.',
          durationMinutes: 45,
          price: 1200,
          category: 'Other',
          isActive: true
        },
        {
          title: 'Occupational Therapy',
          description: 'Focused on developing fine motor skills, sensory processing, and daily life skills to help children achieve ultimate independence.',
          durationMinutes: 45,
          price: 1500,
          category: 'Therapy',
          isActive: true
        },
        {
          title: 'Sensory Integration',
          description: 'Specialized activities that help children process and respond effectively to sensory stimuli (touch, sound, movement).',
          durationMinutes: 45,
          price: 1500,
          category: 'Therapy',
          isActive: true
        },
        {
          title: 'Speech & Language Therapy',
          description: 'Enhances verbal and non-verbal communication, speech clarity, vocabulary development, and social conversation skills.',
          durationMinutes: 45,
          price: 1500,
          category: 'Therapy',
          isActive: true
        },
        {
          title: 'Art Therapy',
          description: 'Creative and expressive therapy using drawing, painting, and crafting to help children communicate feelings and build confidence.',
          durationMinutes: 45,
          price: 1000,
          category: 'Therapy',
          isActive: true
        },
        {
          title: 'Behaviour Therapy',
          description: 'Positive reinforcement and targeted behavioral interventions to replace challenging behaviors with functional, positive social skills.',
          durationMinutes: 45,
          price: 1800,
          category: 'Therapy',
          isActive: true
        },
        {
          title: 'Social Play Therapy',
          description: 'Interactive sessions designed to teach children sharing, turn-taking, cooperation, and how to make meaningful peer connections.',
          durationMinutes: 45,
          price: 1200,
          category: 'Therapy',
          isActive: true
        },
        {
          title: 'Cognitive Behaviour Therapy',
          description: 'Helps older children understand the connection between thoughts, feelings, and actions, providing coping strategies for anxiety and stress.',
          durationMinutes: 50,
          price: 2000,
          category: 'Therapy',
          isActive: true
        },
        {
          title: 'Group Play Therapy',
          description: 'Structured small-group settings where children learn peer interaction, communication, and team play.',
          durationMinutes: 60,
          price: 1000,
          category: 'Therapy',
          isActive: true
        }
      ];
      
      await Service.insertMany(defaultServices);
      services = await Service.find({ isActive: true });
    }
    
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service && service.isActive) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req, res) => {
  try {
    const { title, description, durationMinutes, price, imageUrl, category } = req.body;
    const service = new Service({
      title,
      description,
      durationMinutes,
      price,
      imageUrl,
      category
    });
    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
