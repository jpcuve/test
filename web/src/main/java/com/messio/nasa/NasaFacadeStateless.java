package com.messio.nasa;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * Created by jpc on 11-09-16.
 */
@Stateless(name = "nasa/nasa-facade-stateless")
@LocalBean
public class NasaFacadeStateless {
    @PersistenceContext(unitName = "example")
    private EntityManager em;

    public CrewMemberEntity findCrewMember(final String name){
        return em.createNamedQuery(CrewMemberEntity.CREW_MEMBER_BY_NAME, CrewMemberEntity.class).setParameter("name", name).getSingleResult();
    }

    public MissionEntity findMission(final String name){
        return em.createNamedQuery(MissionEntity.MISSION_BY_NAME, MissionEntity.class).setParameter("name", name).getSingleResult();
    }

    public <E> E create(E e){
        em.persist(e);
        return e;
    }

    public <E> E update(E e){
        return em.merge(e);
    }


}
