---
name: "Asset Management in Pelilauta.social"
shortname: 'Asset Management'
noun: 'veil-advance'
---

The asset management strategy for Pelilauta.social, built on Firebase.

**Key Principles:**

* **Organization:** Assets are organized hierarchically, mirroring the structure of the application (Threads, Sites, Accounts).
* **Efficiency/Privacy/IP:**  Storage usage is optimized by deleting assets when associated content is removed.
* **Security:** Access control rules are implemented to ensure data privacy and prevent unauthorized access.

**Asset Locations:**

* **Threads:** Each thread with associated assets will have a corresponding folder in Firebase Storage. The folder name will match `/Threads/{threadId}/`.
* **Sites:**  Similar to threads, each site with assets will have a dedicated folder in Firebase Storage. The folder name will match `/Sites/{siteId}/`.
* **Accounts:** Each user account will have a storage folder in `/Accounts/{userId}/` for their personal assets.


