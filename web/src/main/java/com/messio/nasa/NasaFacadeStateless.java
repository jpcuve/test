package com.messio.nasa;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * Created by jpc on 11-09-16.
 */
@Stateless
@LocalBean
public class NasaFacadeStateless {
    @PersistenceContext(unitName = "example")
    private EntityManager em;


}
