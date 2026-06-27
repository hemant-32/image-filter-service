# Udacity Cloud Developer Nanodegree - Project 1: Image Filter Service

An Express-based RESTful API deployed on AWS Elastic Beanstalk that downloads public images, applies a greyscale and resize filter utilizing Jimp, serves the processed image back to the user, and immediately wipes temporary disk files to ensure zero storage overhead.

---

## 🚀 Live Deployment Information

* **Live Cloud Application URL:** `http://image-filter-dev.eba-ja6nn3us.us-east-1.elasticbeanstalk.com/`

### 🧪 Verified Functional Test Link
Click the live cloud link below to immediately test the image processor endpoint (utilizing a verified public Unsplash source bypass to circumvent external CDN firewall blocks on AWS infrastructure):
* [Click here to test live image filtering](http://image-filter-dev.eba-ja6nn3us.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500)

---

## 🛠️ API Endpoint Specifications

### `GET /filteredimage`

Processes and filters an incoming public image asset.

* **Query Parameters:**
  * `image_url`: A fully-qualified, public HTTP/HTTPS string pointing to a valid image asset.
* **Success Response:**
  * **Code:** `200 OK`
  * **Content:** Returns the raw binary stream of a $256 \times 256$ square, greyscale `.jpg` image file.
* **Error Handlers implemented:**
  * **Code:** `400 Bad Request` -> Triggered if the `image_url` parameter is missing or blank.
  * **Code:** `422 Unprocessable Entity` -> Triggered if the image download fails, is malformed, or is blocked by upstream firewalls (e.g., Wikimedia CDN rules against cloud hosting blocks).

---

## 🗂️ Engineering & Code Architecture
* **Node.js Environment:** Built using ECMAScript Modules (`import`/`export` syntax) with Node v22 LTS on Amazon Linux 2023 execution layers.
* **Robust Path Resolution:** Enhanced using `path.basename` combined with an absolute execution context `{ root: process.cwd() }` to guarantee seamless path mapping across local Windows development platforms and cloud Linux distributions.
* **Storage Isolation Execution:** Implements synchronous file transmission tracking callbacks to execute the `deleteLocalFiles` pipeline instantly after data streams finish, preventing server disk space exhaustion.