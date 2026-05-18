/**
 * Blockchain Controller
 *
 * Controller untuk mengelola semua logika bisnis terkait
 * pengambilan dan pemrosesan data transaksi blockchain
 * dari Etherscan API (Sepolia testnet).
 */

const axios = require("axios");

// ============================================
// Konfigurasi dari environment variables
// ============================================
const ETHERSCAN_BASE_URL =
  process.env.ETHERSCAN_BASE_URL || "https://api-sepolia.etherscan.io/api";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

/**
 * Mengkonversi Unix timestamp menjadi format tanggal yang mudah dibaca.
 *
 * @param {string|number} timestamp - Unix timestamp (dalam detik)
 * @returns {string} Tanggal dalam format "DD/MM/YYYY HH:mm:ss WIB"
 */
function formatTimestamp(timestamp) {
  const date = new Date(Number(timestamp) * 1000);

  return date.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Mengambil data transaksi lengkap dari Etherscan API.
 *
 * Endpoint: GET /api/transactions
 * Mengembalikan seluruh data transaksi mentah dari smart contract
 * yang terdaftar di Sepolia testnet.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
const getTransactions = async (req, res) => {
  try {
    // Validasi: pastikan konfigurasi API tersedia
    if (!ETHERSCAN_API_KEY || !CONTRACT_ADDRESS) {
      return res.status(500).json({
        success: false,
        message:
          "Konfigurasi belum lengkap. Pastikan ETHERSCAN_API_KEY dan CONTRACT_ADDRESS sudah diatur di file .env",
      });
    }

    // Kirim request ke Etherscan API
    const response = await axios.get(ETHERSCAN_BASE_URL, {
      params: {
        module: "account",
        action: "txlist",
        address: CONTRACT_ADDRESS,
        startblock: 0,
        endblock: 99999999,
        sort: "desc",
        apikey: ETHERSCAN_API_KEY,
      },
    });

    // Periksa response dari Etherscan
    if (response.data.status !== "1") {
      return res.status(404).json({
        success: false,
        message: response.data.message || "Tidak ada transaksi ditemukan",
        result: [],
      });
    }

    // Kirim data transaksi lengkap
    return res.status(200).json({
      success: true,
      message: "Data transaksi berhasil diambil",
      count: response.data.result.length,
      result: response.data.result,
    });
  } catch (error) {
    console.error("[ERROR] Gagal mengambil transaksi:", error.message);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data transaksi",
      error: error.message,
    });
  }
};

/**
 * Mengambil data transaksi dalam format yang disederhanakan.
 *
 * Endpoint: GET /api/transactions/simple
 * Mengembalikan hanya field penting: hash, from, to, dan timestamp
 * dalam format yang mudah dibaca untuk kebutuhan dashboard frontend.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
const getSimpleTransactions = async (req, res) => {
  try {
    // Validasi: pastikan konfigurasi API tersedia
    if (!ETHERSCAN_API_KEY || !CONTRACT_ADDRESS) {
      return res.status(500).json({
        success: false,
        message:
          "Konfigurasi belum lengkap. Pastikan ETHERSCAN_API_KEY dan CONTRACT_ADDRESS sudah diatur di file .env",
      });
    }

    // Kirim request ke Etherscan API
    const response = await axios.get(ETHERSCAN_BASE_URL, {
      params: {
        module: "account",
        action: "txlist",
        address: CONTRACT_ADDRESS,
        startblock: 0,
        endblock: 99999999,
        sort: "desc",
        apikey: ETHERSCAN_API_KEY,
      },
    });

    // Periksa response dari Etherscan
    if (response.data.status !== "1") {
      return res.status(404).json({
        success: false,
        message: response.data.message || "Tidak ada transaksi ditemukan",
        result: [],
      });
    }

    // Format data transaksi menjadi bentuk sederhana
    const simplifiedTransactions = response.data.result.map((tx) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      timestamp: formatTimestamp(tx.timeStamp),
    }));

    // Kirim data transaksi yang sudah diformat
    return res.status(200).json({
      success: true,
      message: "Data transaksi (sederhana) berhasil diambil",
      count: simplifiedTransactions.length,
      result: simplifiedTransactions,
    });
  } catch (error) {
    console.error(
      "[ERROR] Gagal mengambil transaksi sederhana:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data transaksi",
      error: error.message,
    });
  }
};

// ============================================
// Export semua controller functions
// ============================================
module.exports = {
  getTransactions,
  getSimpleTransactions,
};
