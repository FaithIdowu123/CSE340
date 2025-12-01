const pool = require("../database/")

/* ***************************
 *  Get review data
 * ************************** */

async function getReviewsByInventory(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.review
            WHERE inv_id = $1`,
            [inv_id]
        )
        return data.rows
    } catch (error) {
        console.error("getReviewsByInventory error" + error)
    }
}

/* ***************************
 *  Post review data
 * ************************** */
async function insertReview(review_text, inv_id, account_id) {
    try {
        const sql = "INSERT INTO public.review (inv_id, account_id, review_text) VALUES ($1, $2, $3) RETURNING *"
        const values = [inv_id, account_id, review_text]
        return await pool.query(sql, values)
    } catch (error) {
        console.error("insertReview error " + error)
    }
}

async function getReviewsById(review_id){
    try {
        const data = await pool.query(
            `SELECT * FROM public.review
            WHERE review_id = $1`,
            [review_id]
        )
        return data.rows[0]
    } catch (error) {
        console.error("getReviewsById error" + error)
    }
}

async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM public.review WHERE review_id = $1"
    const data = await pool.query(sql, [review_id])
    return data
  } catch (error) {
    console.error("deleteReview error " + error)
  }
}

module.exports = {getReviewsByInventory, insertReview, getReviewsById, deleteReview}