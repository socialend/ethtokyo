// import exp from 'constants';
// import React, {useState, useEffect} from 'react'
// import axios from 'axios';

// type Fetch = {
//     status: number,
//     massage: string,
//     result: string,
// };

// export const GetLendingData = () => {
    
//     const [posts, setPosts] = useState<Fetch[]>([])
    
//     useEffect(() => {
//         axios.get('https://kpxwaia6nnabrppiqdi33uvieq.multibaas.com/api/v0/events?contract_address=socialend5', {
//             headers: {
//               Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4YWQxODZjMy01ZDMwLTRhODYtYWEwNy02MmMyNjU2NTMzNmIiLCJpYXQiOjE2ODE1NDAyMzYsInN1YiI6IjEifQ.Q4rylBTUdzoR2CNS_covIgfvAN3DIJ9DzAwkgk67BdA`,
//             },
//         .then(res => {
//             setPosts(res.data)   
//         })
//     },[])
//     return (
//       <div>
//           <ul>
//               {
//                   posts.map(post => <li key={post.result}></li>)
//               }
//           </ul>
//       </div>
//     )
//   }