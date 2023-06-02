# toko-soya
Aplikasi fullstack yang mengelola inventory, penjualan dan pengangkutan komoditi kacang kedelai antara gudang ke gudang, gudang ke pelanggan.

Constraints:
1. Supplier memiliki 2 gudang di Medan dan Banda Aceh. Perusahaan bisa membeli dari keduanya dengan harga yang berbeda.
2. Perusahaan memiliki 1 gudang di Aceh Besar. Digunakan untuk distribusi penjualan di wilayah Banda Aceh dan Aceh Besar.
3. Supplier bisa mengirimkan komoditi ke gudang perusahaan di Aceh Besar atau langsung ke pelanggan diluar Banda Aceh dan Aceh Besar.
4. Komoditi yang akan dikirim ke gudang perusahaan akan transit di terminal barang di Aceh Besar. Dan bisa langsung didistribusikan ke pelanggan di Banda Aceh tanpa perlu masuk dulu ke gudang perusahaan.
5. DO yang dirilis oleh gudang medan akan dikumpulkan oleh dispatcher wakil perusahaan di Medan.
6. Pembelian ke supplier yang belum ditentukan tujuan pengirimannya dan belum diangkut akan menambah stok logical dan stok fisik perusahaan di lokasi gudang supplier.
7. Pembelian ke supplier yang telah ditentukan tujuan pengirimannya walaupun belum diangkut akan mengurangi stock logical perusahaan di gudang supplier.
8. Pembelian ke supplier yang telah diangkut akan mengurangi stok fisik perusahaan di gudang supplier.
9. Komoditi yang sedang dikirimkan ke gudang perusahaan akan menambah stok logical gudang perusahaan. Dan boleh dijual ke pelanggan Banda Aceh dan Aceh Besar.
10. Komoditi yang telah diterima di gudang perusahaan akan menambah stok fisik di gudang perusahaan. Kecuali yang telah dicadangkan akibat penjualan.
11. 

Menggunakan Typescript untuk backend dan frontend.

Backend: 
- Node js
- Expres js
- MySQL
- Prisma ORM

Frontend:
- React js
- Axios
