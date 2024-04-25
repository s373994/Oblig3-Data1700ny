package com.example.oblig3data1700ny;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;


import java.util.List;

    @Repository
    public class BillettRepository {

        @Autowired
        private JdbcTemplate db;
        public void lagreBilletter(Billett enbillett) {
            System.out.println("billetter " + enbillett);
            String sql = "INSERT INTO Billett (film, antallBilletter, fnavn, enavn, epost, telefonNr) VALUES (?, ?, ?, ?, ?, ?)";
            db.update(sql, enbillett.getFilm(), enbillett.getAntallBilletter(), enbillett.getFnavn(),
                    enbillett.getEnavn(), enbillett.getEpost(), enbillett.getTelefonNr());
        }
        public List<Billett> hentAlleBilletter() {
            String sql = "SELECT * FROM Billett";
            List<Billett> alleBilletter = db.query(sql, new BeanPropertyRowMapper<>(Billett.class));
            System.out.println(alleBilletter);
            return alleBilletter;
        }

        public Billett hentEnBillett(Integer id) {
            String sql = "SELECT * FROM Billett WHERE id=?";
            List<Billett> result = db.query(sql, new Object[]{id}, new BeanPropertyRowMapper<>(Billett.class));
            return result.isEmpty() ? null : result.get(0);
        }


        public void slettEn(Integer id) {
            String sql = "DELETE FROM Billett WHERE id=?";
            db.update(sql, id);
        }

        public void slettAlle() {
            String sql = "DELETE FROM Billett";
            db.update(sql);
        }
    }

