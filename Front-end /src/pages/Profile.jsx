import { useEffect, useState } from "react";
import { getProfile } from "../api/auth";

export default function Profile() {
  const [user, setUser] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
    } catch (err) {
      console.error("❌ Impossible de récupérer le profil");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) {
    return <p className="text-gray-600">Chargement du profil...</p>;
  }

  return (
    <div className="bg-white shadow rounded p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">👤 Mon Profil</h2>
      <p>
        <span className="font-semibold">Nom :</span> {user.name}
      </p>
      <p>
        <span className="font-semibold">Email :</span> {user.email}
      </p>
      <p>
        <span className="font-semibold">Rôle :</span>{" "}
        <span
          className={`px-2 py-1 text-sm rounded ${
            user.role === "ADMIN"
              ? "bg-red-500 text-white"
              : user.role === "PREMIUM"
              ? "bg-yellow-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {user.role}
        </span>
      </p>
      <p>
        <span className="font-semibold">Compte créé le :</span>{" "}
        {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
