// // In an API route
// import { withApiAuthRequired } from '../../lib/auth';

// // This handler will only run for authenticated users
// export default withApiAuthRequired(async (req, res, session) => {
//   const { method } = req;
  
//   switch (method) {
//     case 'GET':
//       // Handle GET request
//       break;
//     // ...
//   }
// });

// // In a component
// import { getUserInfo } from '../lib/auth';
// import { useUser } from '@auth0/nextjs-auth0/client';

// function ProfileComponent() {
//   const { user } = useUser();
  
//   if (!user) return <div>Not authenticated</div>;
  
//   const userInfo = getUserInfo({ user });
  
//   return (
//     <div>
//       <h1>Profile</h1>
//       <p>Email: {userInfo.email}</p>
//       {/* ... */}
//     </div>
//   );
// }