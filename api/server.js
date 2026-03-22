const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userType: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: true },
  
  // Brand specific
  projectType: { type: DataTypes.STRING, allowNull: true },
  timeline: { type: DataTypes.STRING, allowNull: true },
  
  // Influencer specific
  niche: { type: DataTypes.STRING, allowNull: true },
  contentType: { type: DataTypes.STRING, allowNull: true },
});

const ContactInfo = sequelize.define('ContactInfo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  category: { // email, phone, location, follow
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  label: { // e.g., "Business Email", "Instagram"
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/create', authenticateJWT, async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await Admin.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Admin already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const newAdmin = await Admin.create({ email, passwordHash });
    res.status(201).json({ message: 'Admin created successfully', id: newAdmin.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/list', authenticateJWT, async (req, res) => {
  try {
    const admins = await Admin.findAll({ attributes: ['id', 'email', 'createdAt'] });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/submissions', async (req, res) => {
  try {
    const submission = await Submission.create(req.body);
    res.status(201).json({ message: 'Submission successful', id: submission.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/submissions', authenticateJWT, async (req, res) => {
  try {
    const submissions = await Submission.findAll({ order: [['createdAt', 'DESC']] });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/contact-info', async (req, res) => {
  try {
    const info = await ContactInfo.findAll({ order: [['category', 'ASC']] });
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/contact-info', authenticateJWT, async (req, res) => {
  try {
    const { id, category, value, label } = req.body;
    if (id) {
      await ContactInfo.update({ category, value, label }, { where: { id } });
      const updated = await ContactInfo.findByPk(id);
      return res.json(updated);
    }
    const created = await ContactInfo.create({ category, value, label });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/contact-info/:id', authenticateJWT, async (req, res) => {
  try {
    await ContactInfo.destroy({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const syncDatabase = async () => {
  try {
    // Wait for DB to be ready. Just a simple retry mechanism.
    let connected = false;
    while (!connected) {
      try {
        await sequelize.authenticate();
        connected = true;
      } catch (err) {
        console.log('Waiting for database...');
        await new Promise(res => setTimeout(res, 2000));
      }
    }
    await sequelize.sync();
    console.log('Database synced successfully');
    
    // Seed default admin if table is empty
    const count = await Admin.count();
    if (count === 0) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin123', salt);
      await Admin.create({ email: 'admin@collexa.social', passwordHash });
      console.log('Seeded default admin (admin@collexa.social / admin123)');
    }

    // Seed default contact info if empty
    const contactCount = await ContactInfo.count();
    if (contactCount === 0) {
      const defaults = [
        { category: 'email', value: 'business@collexa.social', label: 'Business' },
        { category: 'email', value: 'contact@collexa.social', label: 'Contact' },
        { category: 'phone', value: '+91 86306 16359', label: '' },
        { category: 'phone', value: '+91 97921 82280', label: '' },
        { category: 'phone', value: '+91 70918 23115', label: '' },
        { category: 'location', value: 'Greater Noida, Uttar Pradesh', label: '' },
        { category: 'follow', value: 'https://www.instagram.com/collexa_/?hl=en', label: 'Instagram' },
      ];
      await ContactInfo.bulkCreate(defaults);
      console.log('Seeded default contact info');
    }
  } catch (err) {
    console.error('Failed to sync database:', err);
  }
};

app.listen(PORT, async () => {
  console.log(`Collexa Backend running on port ${PORT}`);
  await syncDatabase();
});
