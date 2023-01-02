import buildClient from '../api/build-client'

const Home = ({ currentUser }) => {
  console.log(currentUser)
  return <h1>{currentUser ? 'You are signed in' : 'You are not signed in'}</h1>
}

// Access to server
// Components are not accessible in this statement
Home.getInitialProps = async (context) => {
  const client = buildClient(context)
  const { data } = await client.get('/api/users/current-user').catch((err) => {
    return { data: err }
  })
  console.log('Home data', data)
  return data
}

export default Home
