import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client'
import Header from '../components/Header'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  )
}

// Access to server
// Components are not accessible in this statement
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx)
  const { data } = await client.get('/api/users/current-user').catch((err) => {
    return { data: err }
  })

  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx
    ).catch((err) => {
      return { data: err }
    })
  }

  console.log('pageProps', pageProps)
  return { pageProps, ...data }
}

export default AppComponent
