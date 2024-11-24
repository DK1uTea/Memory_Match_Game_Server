import connection from "../db.js";

// Hàm định dạng ngày thành chuỗi yyyy-MM-dd
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Thêm số 0 nếu tháng có 1 chữ số
    const day = String(d.getDate()).padStart(2, '0');         // Thêm số 0 nếu ngày có 1 chữ số
    return `${year}-${month}-${day}`;
}

export const getGamingPerformance = async (req, res) => {
    const { playerId } = req.params;

    const query = `
    SELECT level, createdDate, score
    FROM GameSession
    WHERE playerId = ?
    ORDER BY level, createdDate ASC;
  `;

    try {
        connection.query(query, [playerId], (err, results) => {
            if (err) {
                console.error("Error fetching gaming performance:", err);
                return res.status(500).json({ error: "Database error" });
            }

            // Tổ chức dữ liệu cho Line Chart
            const performanceData = {};
            results.forEach(row => {
                if (!performanceData[row.level]) {
                    performanceData[row.level] = [];
                }
                performanceData[row.level].push({
                    createdDate: formatDate(row.createdDate), // Định dạng ngày
                    score: row.score,
                });
            });
            console.log('Performance Data: ', performanceData);
            return res.json(performanceData);
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getPlayedTimesOverTime = async (req, res) => {
    const { playerId } = req.params;

    const query = `
    SELECT level, DATE(createdDate) as playDate, COUNT(*) as playCount
    FROM GameSession
    WHERE playerId = ?
    GROUP BY level, playDate
    ORDER BY playDate ASC;
  `;

    try {
        connection.query(query, [playerId], (err, results) => {
            if (err) {
                console.error("Error fetching played times over time:", err);
                return res.status(500).json({ error: "Database error" });
            }

            // Tổ chức dữ liệu cho Bar Chart
            const playCountData = {};
            results.forEach(row => {
                const date = formatDate(row.playDate); // Định dạng ngày
                if (!playCountData[date]) {
                    playCountData[date] = {};
                }
                playCountData[date][`Level ${row.level}`] = row.playCount;
            });
            console.log('Play Count Data: ', playCountData);
            return res.json(playCountData);
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
