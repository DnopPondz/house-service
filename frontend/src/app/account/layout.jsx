import NavBar from '@/Components/NavBar'


const AccountLayout = ({children}) => {
  return (
    <>
    <NavBar />
    {children}
    </>
  )
}

export default AccountLayout