/**
 * Blockchain Routes
 *
 * Mendefinisikan semua route/endpoint terkait data blockchain.
 * Setiap route dihubungkan dengan controller yang sesuai.
 */

const express = require("express");
const router = express.Router();

// Import controller
const {
  getTransactions,
  getSimpleTransactions,
} = require("../controllers/blockchainController");

// ============================================
// Route Definitions
// ============================================

/**
 * GET /api/transactions
 * Mengambil seluruh data transaksi lengkap dari smart contract
 */
router.get("/transactions", getTransactions);

/**
 * GET /api/transactions/simple
 * Mengambil data transaksi dalam format sederhana
 * (hash, from, to, timestamp yang mudah dibaca)
 */
router.get("/transactions/simple", getSimpleTransactions);

module.exports = router;
