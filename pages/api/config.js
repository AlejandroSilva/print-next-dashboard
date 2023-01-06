export default function handler(req, res) {
  res.status(200).json({
    env: process.env
  })
}
