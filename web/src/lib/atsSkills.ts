/** Curated technical-skill phrases the local ATS engine looks for in both
 * the job description and the resume. Deliberately broad across the
 * company categories this site tracks (Big Tech, product, AI, semiconductor,
 * service, startups) rather than narrowed to one stack — a JD-driven match
 * only ever surfaces the subset that's actually mentioned in the JD. */
export const SKILL_DICTIONARY: string[] = [
  // Languages
  "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "C", "Go", "Golang",
  "Rust", "Kotlin", "Swift", "R", "MATLAB", "Scala", "Ruby", "PHP", "Perl", "SQL",

  // Web / backend
  "React", "React.js", "Angular", "Vue", "Vue.js", "Next.js", "Node.js", "Express",
  "Express.js", "Django", "Flask", "FastAPI", "Spring Boot", "Spring", ".NET",
  "REST API", "GraphQL", "Microservices", "gRPC", "WebSockets", "HTML", "CSS",
  "Tailwind CSS", "Redux",

  // Data / AI / ML
  "Machine Learning", "Deep Learning", "Artificial Intelligence", "Natural Language Processing",
  "NLP", "Computer Vision", "TensorFlow", "PyTorch", "Keras", "Scikit-learn",
  "Pandas", "NumPy", "Data Science", "Data Analysis", "Data Engineering",
  "Big Data", "Spark", "Hadoop", "ETL", "LLM", "Large Language Models",
  "Generative AI", "Reinforcement Learning", "OpenCV",

  // Cloud / DevOps
  "AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", "CI/CD",
  "Jenkins", "Terraform", "Ansible", "DevOps", "Linux", "Bash", "Shell Scripting",
  "Nginx", "Load Balancing", "Serverless", "Cloud Computing",

  // Databases
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase", "SQLite", "Oracle",
  "DynamoDB", "Cassandra", "NoSQL",

  // Mobile
  "Android", "iOS", "React Native", "Flutter",

  // CS fundamentals / practices
  "Data Structures", "Algorithms", "Data Structures and Algorithms", "DSA",
  "Object-Oriented Programming", "OOP", "System Design", "Operating Systems",
  "Computer Networks", "DBMS", "Distributed Systems", "Design Patterns",
  "Software Engineering", "Agile", "Scrum", "Unit Testing", "Test-Driven Development",

  // Embedded / hardware (semiconductor companies)
  "Embedded Systems", "Embedded C", "RTOS", "VLSI", "Verilog", "VHDL",
  "FPGA", "Microcontrollers", "PCB Design", "Digital Signal Processing",
  "Computer Architecture", "ARM",

  // Tools
  "Git", "GitHub", "GitLab", "Jira", "Postman", "VS Code", "Figma",

  // Security
  "Cybersecurity", "Network Security", "Penetration Testing", "Cryptography",
];

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "then", "else", "for", "to", "of",
  "in", "on", "at", "by", "with", "from", "as", "is", "are", "was", "were", "be",
  "been", "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "should", "could", "can", "may", "might", "must", "shall", "this", "that",
  "these", "those", "you", "your", "we", "our", "us", "they", "their", "it",
  "its", "he", "she", "his", "her", "who", "whom", "which", "what", "when",
  "where", "why", "how", "all", "any", "both", "each", "few", "more", "most",
  "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so",
  "than", "too", "very", "just", "about", "into", "through", "during", "before",
  "after", "above", "below", "up", "down", "out", "off", "over", "under",
  "again", "further", "once", "here", "there", "also", "etc", "including",
  "including", "per", "within", "across", "including", "including", "role",
  "job", "work", "team", "company", "years", "year", "experience", "skills",
  "ability", "including", "responsibilities", "requirements", "qualifications",
  "preferred", "required", "strong", "excellent", "good", "candidate", "candidates",
]);

export function isStopword(word: string): boolean {
  return STOPWORDS.has(word.toLowerCase());
}
