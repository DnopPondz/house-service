import UserSidebar from "@/Components/UserSidebar";

const UserLayout = ({ children }) => {
  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-2 h-full overflow-y-auto bg-purple-800">
        <UserSidebar />
      </div>
      <div className="col-span-10 bg-gray-100 h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default UserLayout;
