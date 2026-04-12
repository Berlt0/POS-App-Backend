import { insertUser ,fetchUsers} from '../models/user.model.js';

export const syncUser = async (req, res) => {
  try {
    const user = req.body;

    if (!user || !user.username || !user.password || !user.global_id) {
      return res.status(400).json({ success: false, message: 'Invalid user data' });
    }

    const result = await insertUser(user);

    res.status(200).json({success: true, message: 'Successfully inserted user to the database', result});

  } catch (error) {
    console.error('Sync User Error:', error);
    res.status(500).json({ success: false, message: 'Failed to sync user', error: error.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await fetchUsers();

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log("Server Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};