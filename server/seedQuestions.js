const mongoose = require('mongoose');
const Question = require('./models/Question');
const dotenv = require('dotenv');

dotenv.config();

const sampleQuestions = [
  // ============ FRONTEND DEVELOPER QUESTIONS ============
  
  // React Questions
  {
    text: "Explain the difference between functional components and class components in React.",
    category: "technical",
    difficulty: "medium",
    role: "React Developer",
    company: "Generic",
    suggestedAnswer: "Functional components are simple JavaScript functions that return JSX. Class components are ES6 classes that extend React.Component. Functional components with Hooks now have feature parity with class components. Hooks are simpler and more modern approach.",
    keywords: ["functional", "class", "hooks", "lifecycle", "state management"],
    timeLimit: 120
  },
  {
    text: "What is the virtual DOM and how does React use it for optimization?",
    category: "technical",
    difficulty: "medium",
    role: "React Developer",
    company: "Generic",
    suggestedAnswer: "The virtual DOM is an in-memory representation of the real DOM. React uses it to compare (diff) changes and update only the parts that changed in the actual DOM. This reduces expensive DOM operations and improves performance through batching updates.",
    keywords: ["virtual DOM", "reconciliation", "diffing", "performance", "rendering"],
    timeLimit: 120
  },
  {
    text: "Explain React Hooks. What are useState and useEffect used for?",
    category: "technical",
    difficulty: "medium",
    role: "React Developer",
    company: "Generic",
    suggestedAnswer: "Hooks are functions that let you use state and other React features in functional components. useState manages component state. useEffect handles side effects like data fetching, subscriptions, or DOM updates. Both are fundamental to modern React development.",
    keywords: ["hooks", "useState", "useEffect", "side effects", "functional components"],
    timeLimit: 120
  },
  {
    text: "How would you optimize a React application's performance?",
    category: "technical",
    difficulty: "hard",
    role: "React Developer",
    company: "Generic",
    suggestedAnswer: "Use React.memo to prevent unnecessary re-renders, implement code splitting with React.lazy, use useCallback and useMemo for expensive computations, implement virtualization for long lists, optimize images, use production builds, and monitor performance with tools like React DevTools Profiler.",
    keywords: ["optimization", "memoization", "code splitting", "lazy loading", "performance"],
    timeLimit: 180
  },

  // ============ MERN STACK DEVELOPER QUESTIONS ============
  
  {
    text: "Explain the MERN stack. What are the responsibilities of each technology?",
    category: "technical",
    difficulty: "medium",
    role: "MERN Developer",
    company: "Generic",
    suggestedAnswer: "MERN = MongoDB (database), Express.js (backend framework), React (frontend), Node.js (runtime). MongoDB stores data as JSON documents. Express handles routing and API endpoints. React builds the UI. Node.js runs JavaScript on the server side.",
    keywords: ["MERN", "MongoDB", "Express", "React", "Node.js", "full stack"],
    timeLimit: 120
  },
  {
    text: "How would you handle authentication in a MERN application?",
    category: "technical",
    difficulty: "hard",
    role: "MERN Developer",
    company: "Generic",
    suggestedAnswer: "Implement JWT tokens for stateless authentication. User logs in with credentials, server validates and returns a JWT token. Client stores it (typically in localStorage or cookies) and includes it in API request headers. Server validates the token on each protected route.",
    keywords: ["JWT", "authentication", "tokens", "Express middleware", "security"],
    timeLimit: 180
  },
  {
    text: "What are MongoDB indexes and why are they important?",
    category: "technical",
    difficulty: "medium",
    role: "MERN Developer",
    company: "Generic",
    suggestedAnswer: "Indexes improve query performance by creating data structures that allow fast lookups. Without indexes, MongoDB scans all documents. Indexes use B-tree structures. Common indexes are single field, compound, text, and geospatial. They consume disk space, so use them strategically.",
    keywords: ["MongoDB", "indexes", "performance", "query optimization", "B-tree"],
    timeLimit: 120
  },

  // ============ BACKEND/NODE.JS DEVELOPER QUESTIONS ============
  
  {
    text: "Explain the event-driven architecture of Node.js.",
    category: "technical",
    difficulty: "medium",
    role: "Node.js Developer",
    company: "Generic",
    suggestedAnswer: "Node.js uses an event-driven, non-blocking I/O model. It uses an event loop that continuously checks for events and executes callbacks. This allows handling many concurrent requests without creating threads. Events are handled asynchronously using callbacks or promises.",
    keywords: ["event loop", "non-blocking", "asynchronous", "callbacks", "event-driven"],
    timeLimit: 120
  },
  {
    text: "What is the difference between callbacks, promises, and async/await?",
    category: "technical",
    difficulty: "medium",
    role: "Node.js Developer",
    company: "Generic",
    suggestedAnswer: "Callbacks are functions passed as arguments. Promises provide better error handling with .then() and .catch(). Async/await is syntactic sugar for promises, making code look synchronous and easier to read. Async/await is the modern standard for handling asynchronous operations.",
    keywords: ["callbacks", "promises", "async/await", "error handling", "asynchronous"],
    timeLimit: 120
  },
  {
    text: "How would you implement caching in a Node.js application?",
    category: "technical",
    difficulty: "hard",
    role: "Node.js Developer",
    company: "Generic",
    suggestedAnswer: "Use in-memory caching with libraries like Redis for fast access. Implement caching for database queries, API responses, and expensive computations. Set appropriate TTL (time-to-live) values. Use cache invalidation strategies. Monitor cache hit rates.",
    keywords: ["caching", "Redis", "performance", "TTL", "cache invalidation"],
    timeLimit: 150
  },

  // ============ SYSTEM DESIGN QUESTIONS ============
  
  {
    text: "Design a URL shortening service like TinyURL.",
    category: "technical",
    difficulty: "hard",
    role: "System Design Engineer",
    company: "Generic",
    suggestedAnswer: "Use a hash function to generate short codes from long URLs. Store mappings in a database with TTL. Use a load balancer for traffic distribution. Implement caching with Redis for frequently accessed URLs. Consider sharding for scalability. Use CDN for global distribution.",
    keywords: ["system design", "hashing", "caching", "database", "scalability", "load balancing"],
    timeLimit: 300
  },
  {
    text: "Explain how you would design a real-time chat application.",
    category: "technical",
    difficulty: "hard",
    role: "System Design Engineer",
    company: "Generic",
    suggestedAnswer: "Use WebSockets for real-time bidirectional communication. Implement message queuing with RabbitMQ or Kafka for reliability. Store messages in a database. Use Redis for caching active connections and presence data. Implement load balancing to distribute connections across servers.",
    keywords: ["WebSocket", "real-time", "message queue", "Redis", "scalability", "load balancing"],
    timeLimit: 300
  },
  {
    text: "How would you design a scalable e-commerce platform?",
    category: "technical",
    difficulty: "hard",
    role: "System Design Engineer",
    company: "Generic",
    suggestedAnswer: "Use microservices for different domains (users, products, orders, payments). Implement API Gateway for routing. Use databases per service (database per microservice pattern). Implement caching with Redis. Use message queues for async operations. Implement monitoring and logging. Use CDN for static assets.",
    keywords: ["microservices", "scalability", "database sharding", "API gateway", "caching", "async processing"],
    timeLimit: 300
  },

  // ============ FULL STACK DEVELOPER QUESTIONS ============
  
  {
    text: "Describe your approach to building a full-stack feature from database to UI.",
    category: "behavioral",
    difficulty: "medium",
    role: "Full Stack Developer",
    company: "Generic",
    suggestedAnswer: "Start with database design and schema. Build backend API endpoints and validation. Implement frontend components to consume the API. Handle error cases and edge conditions. Write tests for both backend and frontend. Deploy and monitor. Iterate based on feedback.",
    keywords: ["full stack", "workflow", "API design", "testing", "deployment"],
    timeLimit: 150
  },

  // ============ DEVOPS/INFRASTRUCTURE QUESTIONS ============
  
  {
    text: "Explain containerization and Docker. Why is it useful?",
    category: "technical",
    difficulty: "medium",
    role: "DevOps Engineer",
    company: "Generic",
    suggestedAnswer: "Docker packages applications with dependencies into containers. Containers are lightweight VMs that ensure consistency across environments. Benefits: reproducibility, isolation, faster deployment, easier scaling. Uses images (blueprints) and containers (running instances).",
    keywords: ["Docker", "containerization", "images", "containers", "deployment", "consistency"],
    timeLimit: 120
  },
  {
    text: "What is Kubernetes and how does it manage containers?",
    category: "technical",
    difficulty: "hard",
    role: "DevOps Engineer",
    company: "Generic",
    suggestedAnswer: "Kubernetes is an orchestration platform for managing containerized applications at scale. It automates deployment, scaling, and management. Key concepts: pods (smallest unit), services (networking), deployments (scaling), and persistent volumes (storage). Handles rolling updates, self-healing, and load balancing.",
    keywords: ["Kubernetes", "orchestration", "pods", "services", "scaling", "deployment"],
    timeLimit: 180
  },
  {
    text: "Explain CI/CD pipelines and how you would implement one.",
    category: "technical",
    difficulty: "hard",
    role: "DevOps Engineer",
    company: "Generic",
    suggestedAnswer: "CI/CD automates code integration and deployment. CI: automatically run tests on code changes. CD: automatically deploy to staging/production. Use tools like Jenkins, GitLab CI, GitHub Actions. Implement stages: checkout, build, test, deploy. Monitor and rollback on failures.",
    keywords: ["CI/CD", "automation", "Jenkins", "GitHub Actions", "deployment", "testing"],
    timeLimit: 180
  },

  // ============ DATABASE ADMINISTRATOR QUESTIONS ============
  
  {
    text: "What is database normalization and why is it important?",
    category: "technical",
    difficulty: "medium",
    role: "Database Administrator",
    company: "Generic",
    suggestedAnswer: "Normalization organizes data to eliminate redundancy and improve data integrity. Normal forms (1NF, 2NF, 3NF, BCNF) ensure proper data structure. Benefits: reduced storage, improved query performance, easier maintenance. Trade-off: more complex queries requiring joins.",
    keywords: ["normalization", "database design", "redundancy", "ACID", "data integrity"],
    timeLimit: 120
  },
  {
    text: "Compare SQL and NoSQL databases. When would you use each?",
    category: "technical",
    difficulty: "medium",
    role: "Database Administrator",
    company: "Generic",
    suggestedAnswer: "SQL: structured, ACID compliant, good for relational data (e.g., PostgreSQL, MySQL). NoSQL: flexible schema, horizontal scaling, good for unstructured data (e.g., MongoDB, Redis). Use SQL for financial systems, structured data. Use NoSQL for real-time apps, big data, varying schema.",
    keywords: ["SQL", "NoSQL", "ACID", "scalability", "schema flexibility", "data modeling"],
    timeLimit: 120
  },

  // ============ QA/TESTING ENGINEER QUESTIONS ============
  
  {
    text: "Explain different types of software testing and when to use each.",
    category: "technical",
    difficulty: "medium",
    role: "QA Engineer",
    company: "Generic",
    suggestedAnswer: "Unit testing: test individual functions. Integration testing: test module interactions. System testing: test complete system. UAT: user acceptance testing. Performance testing: check speed/load. Security testing: identify vulnerabilities. Use test pyramid: many unit tests, fewer integration/system tests.",
    keywords: ["testing", "unit test", "integration test", "automation", "quality"],
    timeLimit: 150
  },
  {
    text: "How would you automate testing for a web application?",
    category: "technical",
    difficulty: "hard",
    role: "QA Engineer",
    company: "Generic",
    suggestedAnswer: "Use frameworks like Selenium, Cypress, or Playwright for UI testing. Implement API testing with Postman or RestAssured. Write unit tests with Jest/Mocha. Integrate into CI/CD pipeline. Use Page Object Model for maintainability. Test critical user paths first. Aim for high code coverage.",
    keywords: ["test automation", "Selenium", "Cypress", "API testing", "CI/CD", "coverage"],
    timeLimit: 180
  },

  // ============ JAVA DEVELOPER QUESTIONS ============
  
  {
    text: "Explain the concept of Object-Oriented Programming (OOP) in Java.",
    category: "technical",
    difficulty: "medium",
    role: "Java Developer",
    company: "Generic",
    suggestedAnswer: "OOP has four pillars: encapsulation (bundling data and methods), inheritance (reusing code), polymorphism (different forms), and abstraction (hiding complexity). Java supports all through classes, interfaces, and access modifiers (public, private, protected).",
    keywords: ["OOP", "inheritance", "polymorphism", "encapsulation", "abstraction"],
    timeLimit: 120
  },
  {
    text: "What is the difference between JDK, JRE, and JVM?",
    category: "technical",
    difficulty: "easy",
    role: "Java Developer",
    company: "Generic",
    suggestedAnswer: "JVM (Java Virtual Machine) executes bytecode. JRE (Java Runtime Environment) includes JVM and libraries. JDK (Java Development Kit) includes JRE plus tools (compiler, debugger). To run Java: need JRE. To develop: need JDK.",
    keywords: ["JDK", "JRE", "JVM", "bytecode", "compilation"],
    timeLimit: 90
  },
  {
    text: "Explain Spring Framework and Spring Boot. How are they different?",
    category: "technical",
    difficulty: "medium",
    role: "Java Developer",
    company: "Generic",
    suggestedAnswer: "Spring Framework is a full enterprise framework (dependency injection, AOP, MVC). Spring Boot simplifies Spring by providing auto-configuration, embedded servers, and starter dependencies. Spring Boot reduces boilerplate and accelerates development.",
    keywords: ["Spring", "Spring Boot", "dependency injection", "auto-configuration", "frameworks"],
    timeLimit: 120
  },

  // ============ PYTHON DEVELOPER QUESTIONS ============
  
  {
    text: "Explain list comprehensions in Python and provide an example.",
    category: "technical",
    difficulty: "medium",
    role: "Python Developer",
    company: "Generic",
    suggestedAnswer: "List comprehensions create lists concisely. Example: [x*2 for x in range(5)] creates [0, 2, 4, 6, 8]. Can include conditions: [x for x in range(10) if x % 2 == 0]. More readable and faster than loops. Also available for dicts and sets.",
    keywords: ["list comprehension", "syntax", "performance", "readability", "loops"],
    timeLimit: 120
  },
  {
    text: "What is the Global Interpreter Lock (GIL) in Python?",
    category: "technical",
    difficulty: "medium",
    role: "Python Developer",
    company: "Generic",
    suggestedAnswer: "GIL ensures only one thread executes Python bytecode at a time. Prevents memory management issues but limits multithreading for CPU-bound tasks. For I/O-bound tasks, threading/async works fine. For CPU-bound, use multiprocessing instead.",
    keywords: ["GIL", "threading", "multiprocessing", "concurrency", "performance"],
    timeLimit: 120
  },
  {
    text: "Explain decorators in Python with an example.",
    category: "technical",
    difficulty: "medium",
    role: "Python Developer",
    company: "Generic",
    suggestedAnswer: "Decorators modify function behavior without changing code. Example: @property, @staticmethod, @classmethod. Creating custom decorators: use a wrapper function. Useful for logging, authentication, caching. Decorators are 'syntactic sugar' using @decorator_name above function.",
    keywords: ["decorators", "functions", "modifications", "Python", "metaprogramming"],
    timeLimit: 120
  },

  // ============ C++ DEVELOPER QUESTIONS ============
  
  {
    text: "Explain pointers and references in C++. What's the difference?",
    category: "technical",
    difficulty: "medium",
    role: "C++ Developer",
    company: "Generic",
    suggestedAnswer: "Pointers store memory addresses, can be null, reassigned, and dereferenced with *. References are aliases to variables, cannot be null, cannot be reassigned, automatically dereferenced. Use pointers for dynamic memory; use references when you need guaranteed valid targets.",
    keywords: ["pointers", "references", "memory", "dereferencing", "C++"],
    timeLimit: 120
  },
  {
    text: "What is the difference between stack and heap memory in C++?",
    category: "technical",
    difficulty: "medium",
    role: "C++ Developer",
    company: "Generic",
    suggestedAnswer: "Stack: automatic memory for local variables, fast, limited size, freed when scope ends. Heap: manual/dynamic memory, slower, larger, must free explicitly. Use stack for small, known-size data. Use heap for large data or unknown size at compile time.",
    keywords: ["stack", "heap", "memory management", "allocation", "C++"],
    timeLimit: 120
  },

  // ============ MOBILE DEVELOPER (iOS) QUESTIONS ============
  
  {
    text: "Explain the iOS app lifecycle and its key phases.",
    category: "technical",
    difficulty: "medium",
    role: "iOS Developer",
    company: "Generic",
    suggestedAnswer: "App states: Not Running, Inactive, Active, Background, Suspended. Key methods: didFinishLaunchingWithOptions (startup), applicationDidBecomeActive, applicationWillResignActive, applicationDidEnterBackground, applicationWillTerminate. Important for resource management and state preservation.",
    keywords: ["iOS lifecycle", "app states", "UIApplication", "delegate methods"],
    timeLimit: 120
  },

  // ============ MOBILE DEVELOPER (Android) QUESTIONS ============
  
  {
    text: "Explain the Android Activity lifecycle.",
    category: "technical",
    difficulty: "medium",
    role: "Android Developer",
    company: "Generic",
    suggestedAnswer: "Activity states: Created, Started, Resumed, Paused, Stopped, Destroyed. Key callbacks: onCreate, onStart, onResume, onPause, onStop, onDestroy. Understanding lifecycle is crucial for managing resources, handling interruptions, and maintaining app state.",
    keywords: ["Activity", "lifecycle", "onCreate", "onPause", "onDestroy"],
    timeLimit: 120
  },

  // ============ CLOUD ENGINEER (AWS) QUESTIONS ============
  
  {
    text: "Explain core AWS services: EC2, S3, RDS, and Lambda.",
    category: "technical",
    difficulty: "medium",
    role: "AWS Developer",
    company: "Generic",
    suggestedAnswer: "EC2: virtual servers (compute). S3: object storage. RDS: managed relational databases. Lambda: serverless functions. These are fundamental AWS services. EC2 for general computing, S3 for file storage, RDS for databases, Lambda for event-driven tasks.",
    keywords: ["AWS", "EC2", "S3", "RDS", "Lambda", "cloud services"],
    timeLimit: 120
  },

  // ============ CLOUD ENGINEER (GCP) QUESTIONS ============
  
  {
    text: "Explain Google Cloud Platform services: Compute Engine, Cloud Storage, Cloud SQL, and Cloud Functions.",
    category: "technical",
    difficulty: "medium",
    role: "GCP Developer",
    company: "Generic",
    suggestedAnswer: "Compute Engine: VMs (similar to EC2). Cloud Storage: object storage. Cloud SQL: managed databases. Cloud Functions: serverless. GCP provides similar services to AWS with different naming. Focus on integration between services.",
    keywords: ["GCP", "Google Cloud", "Compute Engine", "Cloud Storage", "serverless"],
    timeLimit: 120
  },

  // ============ SECURITY/INFOSEC QUESTIONS ============
  
  {
    text: "Explain common web vulnerabilities: SQL injection, XSS, and CSRF.",
    category: "technical",
    difficulty: "hard",
    role: "Security Engineer",
    company: "Generic",
    suggestedAnswer: "SQL Injection: malicious SQL in input. Prevention: parameterized queries. XSS: script injection in HTML. Prevention: input validation, output encoding. CSRF: forged requests. Prevention: tokens, same-site cookies. Always validate/sanitize inputs, use security headers.",
    keywords: ["security", "SQL injection", "XSS", "CSRF", "vulnerabilities", "prevention"],
    timeLimit: 150
  },

  // ============ DATA SCIENTIST QUESTIONS ============
  
  {
    text: "Explain the difference between supervised and unsupervised learning.",
    category: "technical",
    difficulty: "medium",
    role: "Data Scientist",
    company: "Generic",
    suggestedAnswer: "Supervised: labeled data, predict outcomes (classification, regression). Examples: spam detection, house price prediction. Unsupervised: unlabeled data, find patterns (clustering, dimensionality reduction). Examples: customer segmentation, anomaly detection.",
    keywords: ["machine learning", "supervised", "unsupervised", "classification", "clustering"],
    timeLimit: 120
  },

  // ============ TECHNICAL SUPPORT / GENERAL QUESTIONS ============
  
  {
    text: "Tell me about a time when you debugged a complex technical issue.",
    category: "behavioral",
    difficulty: "medium",
    role: "Software Engineer",
    company: "Generic",
    suggestedAnswer: "Describe systematic debugging approach: gather information, reproduce issue, narrow scope, check logs, use debugging tools, test hypothesis. Example: found memory leak by profiling, identified problematic library, implemented caching solution, verified fix reduced memory by 40%.",
    keywords: ["debugging", "problem solving", "analysis", "tools", "systematic"],
    timeLimit: 120
  },
  {
    text: "How do you stay updated with latest technologies and best practices?",
    category: "behavioral",
    difficulty: "easy",
    role: "Software Engineer",
    company: "Generic",
    suggestedAnswer: "Read tech blogs, follow GitHub trending, take online courses, contribute to open source, attend conferences, practice with side projects, read documentation, join developer communities. Stay curious and invest time in learning.",
    keywords: ["learning", "continuous improvement", "community", "curiosity", "growth mindset"],
    timeLimit: 90
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert sample questions
    const insertedQuestions = await Question.insertMany(sampleQuestions);
    console.log(`Inserted ${insertedQuestions.length} sample questions`);

    // Display inserted questions grouped by role
    const questionsByRole = {};
    insertedQuestions.forEach(q => {
      if (!questionsByRole[q.role]) {
        questionsByRole[q.role] = 0;
      }
      questionsByRole[q.role]++;
    });

    console.log('\nQuestions by Role:');
    Object.entries(questionsByRole).forEach(([role, count]) => {
      console.log(`  ${role}: ${count} questions`);
    });

    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleQuestions, seedDatabase };
