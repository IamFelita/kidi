import React, { useState } from "react";
import {
	auth,
	db,
} from "../firebase/firebaseConfig"; // Firebase Import
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import appPreview from "../assets/appPreview.jpg";
import {
	getDocs,
	query,
	collection,
	where,
} from "firebase/firestore";

// Fungsi untuk mengecek apakah email sudah terdaftar
const checkIfEmailExists = async (email) => {
	const usersRef = collection(db, "users");
	const q = query(
		usersRef,
		where("email", "==", email)
	);
	const querySnapshot = await getDocs(q);

	return !querySnapshot.empty; // True jika email sudah ada
};

const SignupPage = ({ onClose }) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] =
		useState(false);
	const [isSuccess, setIsSuccess] =
		useState(false); // Notifikasi keberhasilan

	// Fungsi untuk submit form signup
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// Periksa apakah email sudah digunakan
			const emailExists =
				await checkIfEmailExists(email);
			if (emailExists) {
				alert(
					"Email sudah terdaftar. Silakan gunakan email lain atau login."
				);
				return;
			}

			// Buat akun baru
			const userCredential =
				await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
			const user = userCredential.user;

			// Simpan data pengguna ke Firestore
			await setDoc(doc(db, "users", user.uid), {
				name,
				email,
				role: "user", // Set default role sebagai "user"
			});

			setIsSuccess(true);

			// Tutup form signup setelah sukses
			setTimeout(() => {
				setIsSuccess(false);
				onClose();
			}, 1000);
		} catch (error) {
			if (
				error.code === "auth/email-already-in-use"
			) {
				alert(
					"Email sudah terdaftar. Silakan gunakan email lain atau login."
				);
			} else {
				console.error(
					"Error during signup:",
					error
				);
				alert("Signup gagal. Silakan coba lagi.");
			}
		}
	};

	return (
		<div className="min-h-screen bg-color_nuetral_100_light">
			<div className="h-auto overflow-hidden">
				{/* Tombol Kembali */}
				<button
					onClick={onClose}
					className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 text-lg font-semibold flex items-center space-x-2">
					<span className="text-3xl">←</span>
				</button>

				{/* Notifikasi Berhasil */}
				{isSuccess && (
					<div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-black text-lg font-semibold px-4 py-2">
						Akun berhasil dibuat!
					</div>
				)}

				<div className="flex flex-col lg:flex-row">
					{/* Form Signup */}
					<div className="w-full lg:w-1/2 p-8 pt-16">
						<div className="max-w-md mx-auto">
							<h2 className="text-blue-500 text-center text-3xl font-semibold mb-2">
								Buat Akun
							</h2>
							<p className="text-gray-400 text-center font-plusjakartasans mb-8 text-sm">
								Bergabung dan dapatkan informasi
								baru dari kedai kami
							</p>

							<form
								onSubmit={handleSubmit}
								className="space-y-6">
								<div>
									<label
										htmlFor="name"
										className="block text-md font-semibold text-gray-700 mb-1">
										Nama Anda
									</label>
									<input
										type="text"
										id="name"
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
										placeholder="Masukkan nama Anda"
										required
										className="w-full text-regular px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label
										htmlFor="email"
										className="block text-md font-semibold text-gray-700 mb-1">
										Email Anda
									</label>
									<input
										type="email"
										id="email"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										placeholder="Masukkan email Anda"
										required
										className="w-full text-regular px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label
										htmlFor="password"
										className="block text-md font-semibold text-gray-700 mb-1">
										Password
									</label>
									<div className="relative">
										<input
											type={
												showPassword
													? "text"
													: "password"
											}
											id="password"
											value={password}
											onChange={(e) =>
												setPassword(
													e.target.value
												)
											}
											placeholder="min. 8 karakter"
											required
											minLength={8}
											className="w-full text-regular px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
										<button
											type="button"
											onClick={() =>
												setShowPassword(
													!showPassword
												)
											}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
											{showPassword ? "👁️" : "👁️‍🗨️"}
										</button>
									</div>
								</div>

								<button
									type="submit"
									className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg">
									Buat Akun
								</button>
							</form>

							<p className="mt-6 text-center font-semibold text-sm">
								Sudah memiliki akun?{" "}
								<a
									href="/login"
									className="text-blue-500 font-semibold hover:underline">
									Masuk
								</a>
							</p>

							<p className="mt-8 text-center text-xs text-gray-500">
								© 2024 Kedai Manang. All rights
								reserved.
							</p>
						</div>
					</div>

					{/* Gambar Samping */}
					<div className="hidden lg:flex w-1/2 bg-blue-500 p-8 text-white items-center justify-center">
						<div className="max-w-lg">
							<h2 className="text-4xl font-semibold text-center mb-8">
								Jajanan terjangkau
								<br />
								solusi perut lapar
							</h2>
							<div className="relative w-full max-w-md mx-auto h-auto rounded-3xl overflow-hidden shadow-xl">
								<img
									src={
										appPreview ||
										"/placeholder.svg"
									}
									alt="App Preview"
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignupPage;
