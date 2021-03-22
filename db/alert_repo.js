class AlertRepo {
    constructor(dao) {
      this.dao = dao
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS "alerts" (
        "trid"	INTEGER NOT NULL,
        "symbol"	TEXT,
        "alertOn"	TEXT,
        "currency"	TEXT,
        "condition"	TEXT,
        "price1"	TEXT,
        "price2"	INTEGER,
        "gotSend"	INTEGER,
        PRIMARY KEY("trid")
    )`
      return this.dao.run(sql)
    }

    create(content) {
        const {trid, symbol,alertOn,currency,condition,price1,price2,gotSend} = content
        return this.dao.run(
          `INSERT INTO alerts (trid, 
          symbol,
          alertOn,
          currency,
          condition,
          price1,
          price2,
          gotSend)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [trid, 
            symbol,
            alertOn,
            currency,
            condition,
            price1,
            price2,
            gotSend])
      }

      update(content) {
        const {trid, newGotSend} = content
        console.log(content)
        console.log("In content: " + content + "IN DB update trid: " + trid + "gotSend: " + newGotSend)
        return this.dao.run(
            `UPDATE alerts SET gotSend = ? WHERE trid = ?`,
            [newGotSend, trid]
          )
      }

      delete(trid) {
        return this.dao.run(
          `DELETE FROM alerts WHERE trid = ?`,
          [trid]
        )
      }

      getAll() {
        return this.dao.all(`SELECT * FROM alerts`)
      }

  }


  
  module.exports = AlertRepo;