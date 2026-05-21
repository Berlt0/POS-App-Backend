import db from '../config/db.js';

export const findUserById = async (global_id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE global_id = ?', [global_id]);
  return rows;
};


export const insertUser = async (user) => {
  const connection = await db.getConnection();

  try {

    const [existing] = await connection.query(
      `SELECT id FROM users WHERE global_id = ?`,
      [user.global_id]
    );

    if (existing.length > 0) {
      return { success: true, message: 'User already exists', userId: existing[0].id };
    }


    const [result] = await connection.query(
      `INSERT INTO users (global_id,username, password, role, name, email, contact_number, address, createdAt, updated_at, image_path, is_disabled, deleted_at, is_synced) 
       VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.global_id,
        user.username,
        user.password,
        user.role,
        user.name,
        user.email,
        user.contact_number,
        user.address,
        user.createdAt,
        user.updated_at,
        user.image_path,
        user.is_disabled,
        user.deleted_at,
        1
      ]
    );

    return { success: true, message: 'User synced successfully', userId: result.insertId };
  } catch (error) {
    console.error('Insert User Error:', error);
    throw error;
  } finally {
    connection.release();
  }
};


export const updateUserData = async (user) => {
  const connection = await db.getConnection();

  try {
    const [existing] = await connection.query(
      `SELECT id, updated_at FROM users WHERE global_id = ?`,
      [user.global_id]
    );

    if (existing.length === 0) {
      return { success: false, message: 'User not found' };
    }

    const serverUpdated = existing[0].updated_at
      ? new Date(existing[0].updated_at)
      : new Date(0);

    const clientUpdated = user.updated_at
      ? new Date(user.updated_at)
      : new Date(0);

    console.log(`Client updated_at: ${user.updated_at}`);
    console.log(`Server updated_at: ${existing[0].updated_at}`);
    console.log(`Client newer: ${clientUpdated > serverUpdated}`);

    if (clientUpdated <= serverUpdated) {
      return { success: true, message: 'No update needed — server already has newer data' };
    }

    await connection.query(
      `UPDATE users SET
        username = ?,
        password = ?,
        role = ?,
        name = ?,
        email = ?,
        contact_number = ?,
        address = ?,
        updated_at = ?,
        image_path = ?,
        is_disabled = ?,
        deleted_at = ?
       WHERE global_id = ?`,
      [
        user.username,
        user.password,
        user.role,
        user.name,
        user.email,
        user.contact_number,
        user.address,
        user.updated_at,
        user.image_path,
        user.is_disabled ?? 0,
        user.deleted_at,
        user.global_id,
      ]
    );

    console.log(`User ${user.global_id} updated on server`);
    return { success: true, message: 'User updated successfully' };

  } catch (error) {
    console.error('Update User Error:', error);
    throw error;
  } finally {
    connection.release();
  }
};




export const fetchUsers = async () => {
  const connection = await db.getConnection();

  try {
    const [users] = await connection.query("SELECT * FROM users");
    return users;
  } catch (error) {
    console.log("Server Error:", error);
    throw error;
  } finally {
    connection.release();
  }
};