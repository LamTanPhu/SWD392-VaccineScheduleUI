import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { RELATIONSHIPS, USERS } from "../../../utils/constants";

const GENDERS = {
  male: "Nam",
  female: "Nữ",
};
export default function UserDetail() {
  const { id } = useParams();

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    children: [
      {
        relationship: "",
        fullName: "",
        gender: "",
        birthDate: "",
        allergies: "",
      },
    ],
  });

  useEffect(() => {
    const user = USERS.find((user) => user.id === Number(id));
    if (user) {
      setUser(user);
    }
  }, []);
  return (
    <div>
      <h1 className="text-lg font-bold text-primary border-b border-primary w-fit pb-1 mb-5">
        User's Information
      </h1>
      <div className="grid grid-cols-1 gap-2 items-start">
        <section className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="fullName">
              Parent's Name
            </label>
            <input type="text" id="fullName" value={user.fullName} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="email">
              Email
            </label>
            <input type="text" id="email" value={user.email} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="phone">
              Phone
            </label>
            <input type="text" id="phone" value={user.phone} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="address">
              Adress
            </label>
            <input type="text" id="address" value={user.address} />
          </div>
          <h1 className="text-lg font-bold text-primary border-b border-primary w-fit pb-1 my-5">
            Child
          </h1>
          <table className="w-full border-collapse border border-gray col-span-2">
            <thead className="bg-gray">
              <tr>
                <th className="p-2">Full Name</th>
                <th className="p-2">Gender</th>
                <th className="p-2">Dob</th>
                <th className="p-2">Relationshop</th>
                <th className="p-2">Allergics</th>
              </tr>
            </thead>
            <tbody>
              {user.children.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 border border-gray text-center">
                   {item.fullName}
                </td>
                <td className="p-2 border border-gray text-center">
                  {GENDERS[item.gender]}
                </td>
                <td className="p-2 border border-gray text-center">
                  {item.birthDate}
                  </td>
                  <td className="p-2 border border-gray text-center">
                    {RELATIONSHIPS.find((relationship) => relationship.id == item.relationship)?.name}
                  </td>
                  <td className="p-2 border border-gray text-center">
                    {item.allergies}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section>
          <div className="w-full">
            <h1 className="text-lg font-bold text-primary border-b border-primary w-fit pb-1 my-5">
              Vaccination history
            </h1>
            <table className="w-full border-collapse border border-gray">
              <thead className="bg-gray">
                <tr>
                  <th className="p-2">Injection date</th>
                  <th className="p-2">Child's Name</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border border-gray text-center">
                      2024-01-01
                    </td>
                    <td className="p-2 border border-gray text-center">
                      Trần Văn A
                    </td>
                    <td className="p-2 border border-gray text-center">
                      <a href="#">View details</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}