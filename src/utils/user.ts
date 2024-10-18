export async function getUserByEmail(email: string) {
    try {
      // Use an environment variable for the base URL
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.beams.world';
      const response = await fetch(`${baseUrl}/api/user?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const user = await response.json();
      if (user && user._id) {
        user.id = user._id;
        delete user._id;
      }
      // console.log('response',user)
      return user;
    } catch (error) {
      console.error(`Error fetching user with email ${email}:`, error);
      return null;
    }
  }