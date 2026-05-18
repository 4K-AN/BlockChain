// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract HealthChain {

    address public owner;
    address public alamatDistributor;
    address public alamatApotek;

    struct Medicine {
        uint id;
        string nama;
        address produsen;
        address distributor;
        address apotek;
        string status;
        uint timestamp;
    }

    mapping(uint => Medicine) public medicines;
    uint public medicineCount = 0;

    constructor(address _distributor, address _apotek) {
        owner = msg.sender;
        alamatDistributor = _distributor;
        alamatApotek = _apotek;
    }

    function produksiObat(string memory _nama) public {
        require(msg.sender == owner, "Hanya produsen yang bisa mendaftarkan obat");
        medicineCount++;
        medicines[medicineCount] = Medicine(
            medicineCount,
            _nama,
            msg.sender,
            address(0),
            address(0),
            "Diproduksi",
            block.timestamp
        );
    }

    function kirimKeDistributor(uint _id) public {
        require(msg.sender == owner, "Hanya produsen yang bisa mengirim ke distributor");
        require(medicines[_id].id != 0, "ID obat tidak ditemukan");
        require(
            keccak256(bytes(medicines[_id].status)) == keccak256(bytes("Diproduksi")),
            "Status obat harus Diproduksi"
        );
        medicines[_id].status = "Dalam Pengiriman ke Distributor";
        medicines[_id].distributor = alamatDistributor;
        medicines[_id].timestamp = block.timestamp;
    }

    function terimaOlehDistributor(uint _id) public {
        require(msg.sender == alamatDistributor, "Hanya distributor yang bisa konfirmasi");
        require(medicines[_id].id != 0, "ID obat tidak ditemukan");
        require(
            keccak256(bytes(medicines[_id].status)) == keccak256(bytes("Dalam Pengiriman ke Distributor")),
            "Status obat tidak sesuai"
        );
        medicines[_id].status = "Diterima Distributor";
        medicines[_id].timestamp = block.timestamp;
    }

    function kirimKeApotek(uint _id) public {
        require(msg.sender == alamatDistributor, "Hanya distributor yang bisa kirim ke apotek");
        require(medicines[_id].id != 0, "ID obat tidak ditemukan");
        require(
            keccak256(bytes(medicines[_id].status)) == keccak256(bytes("Diterima Distributor")),
            "Status obat harus Diterima Distributor"
        );
        medicines[_id].status = "Dalam Pengiriman ke Apotek";
        medicines[_id].apotek = alamatApotek;
        medicines[_id].timestamp = block.timestamp;
    }

    function terimaOlehApotek(uint _id) public {
        require(msg.sender == alamatApotek, "Hanya apotek yang bisa konfirmasi");
        require(medicines[_id].id != 0, "ID obat tidak ditemukan");
        require(
            keccak256(bytes(medicines[_id].status)) == keccak256(bytes("Dalam Pengiriman ke Apotek")),
            "Status obat tidak sesuai"
        );
        medicines[_id].status = "Tiba di Apotek";
        medicines[_id].timestamp = block.timestamp;
    }

    function lacakObat(uint _id) public view returns (
        string memory nama,
        string memory status,
        address produsen,
        address distributor,
        address apotek,
        uint timestamp
    ) {
        require(medicines[_id].id != 0, "ID obat tidak ditemukan");
        Medicine memory m = medicines[_id];
        return (m.nama, m.status, m.produsen, m.distributor, m.apotek, m.timestamp);
    }
}