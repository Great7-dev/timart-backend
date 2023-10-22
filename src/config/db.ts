import { QueryTypes, Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'mysql', // You can change this to your preferred database dialect
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'test',
});

export async function getTopUsersWithMostOrders() {
  try {
    const result = await sequelize.query(`
      SELECT u.id, u.username, COUNT(o.id) AS order_count
      FROM Users AS u
      LEFT JOIN Orders AS o ON u.id = o.userId
      GROUP BY u.id, u.username
      ORDER BY order_count DESC
      LIMIT 10;
    `, {
      type: QueryTypes.SELECT,
    });

    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function createTables() {
  try {
    await sequelize.query(
      `
      CREATE TABLE Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
      CREATE TABLE Orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        name VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        address VARCHAR(50) NOT NULL,
        totalamount DECIMAL(10, 2) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES Users(id)
      );
      `,
      { type: QueryTypes.RAW, raw: true }
    );

    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    sequelize.close();
  }
}

createTables();


