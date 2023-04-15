import exp from 'constants';
import React, {useState, useEffect} from 'react'
import axios from 'axios';

type Fetch = {
    id: number,
    title: string,
};

export const GetLendingData = () => {
    
    const [posts, setPosts] = useState<Fetch[]>([])
    
    useEffect(() => {
        axios.get('https://kpxwaia6nnabrppiqdi33uvieq.multibaas.com/api/v0/events?contract_address=socialend5')
        .then(res => {
            setPosts(res.data)   
        })
    },[])
    return (
      <div>
          <ul>
              {
                  posts.map(post => <li key={post.id}>{post.title}</li>)
              }
          </ul>
      </div>
    )
  }