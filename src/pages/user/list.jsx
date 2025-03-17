import { USERS } from "../../../utils/constants";

export default function UserList() {
  return (
    <div>
      <h1 className="text-lg font-bold text-primary border-b border-primary w-fit pb-1 mb-5">
        User List
      </h1>
      <table className="w-full">
        <thead className="bg-gray">
          <tr>
            <th className="p-2">Id</th>
            <th className="p-2">Parent's Name</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Adress</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {USERS.map((item) => {
            return (
              <tr key={item.id}>
                <td className="p-2 border border-gray text-center">
                  {item.id}
                </td>
                <td className="p-2 border border-gray text-center">
                  {item.fullName}
                </td>
                <td className="p-2 border border-gray text-center">
                  {item.phone}
                </td>
                <td className="p-2 border border-gray text-center">
                  {item.address}
                </td>
                <td className="p-2 border border-gray text-center">
                  <a href={`/admin/user/detail/${item.id}`} className="text-primary">
                    View Details
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}