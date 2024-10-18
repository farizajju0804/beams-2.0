export async function getUserByEmail(email: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.beams.world';
    const url = `${baseUrl}/api/user?email=${encodeURIComponent(email)}`;
    // console.log(`Fetching user from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch user. Status: ${response.status}`);
      throw new Error('Failed to fetch user');
    }
    
    const user = await response.json();
    // console.log('User data received:', user);
    
    if (user && user._id) {
      user.id = user._id;
      delete user._id;
      // console.log('Transformed user data:', user);
    } else {
      console.warn('User data does not contain _id field');
    }
    
    return user;
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    return null;
  }
}