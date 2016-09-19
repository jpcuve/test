package com.messio.nasa;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.*;
import java.util.List;
import java.util.logging.Logger;

/**
 * Created by jpc on 7/04/2016.
 */
@Path("/")
@Produces({"application/json"})
@Stateless
public class NasaService {
    private static final Logger LOGGER = Logger.getLogger(NasaService.class.getCanonicalName());

    @PersistenceContext(unitName = "example")
    private EntityManager em;

    @GET
    @Path("missions")
    public List<MissionEntity> getMissions(){
        LOGGER.info("Querying missions");
        List<MissionEntity> resultList = em.createQuery("select distinct m from MissionEntity m left join fetch m.crewMemberIds order by m.missionStart", MissionEntity.class).getResultList();
        return resultList;
    }

    @POST
    @Path("missions")
    public MissionEntity saveMission(MissionEntity mission){
        if (mission.getId() == null){
            em.persist(mission);
            return mission;
        }
        return em.merge(mission);
    }

    @GET
    @Path("missions/{id}")
    public MissionEntity getMission(@PathParam("id") int id){
        return em.createQuery("select distinct m from MissionEntity m left join fetch m.crewMemberIds where m.id = :id", MissionEntity.class).setParameter("id", id).getSingleResult();
    }

    @DELETE
    @Path("missions/{id}")
    public void deleteMission(@PathParam("id") int id){
        em.remove(em.find(MissionEntity.class, id));
    }

    @GET
    @Path("crew-members")
    public List<CrewMemberEntity> getCrewMembers(){
        LOGGER.info("Querying crew members");
        return em.createQuery("select distinct cm from CrewMemberEntity cm left join fetch cm.missionIds order by cm.name", CrewMemberEntity.class).getResultList();
    }

    @POST
    @Path("crew-members")
    public CrewMemberEntity saveCrewMember(CrewMemberEntity crewMember){
        if (crewMember.getId() == null){
            em.persist(crewMember);
            return crewMember;
        }
        return em.merge(crewMember);
    }

    @GET
    @Path("crew-members/{id}")
    public CrewMemberEntity getCrewMember(@PathParam("id") int id){
        return em.createQuery("select distinct cm from CrewMemberEntity cm left join fetch cm.missionIds where cm.id = :id", CrewMemberEntity.class).setParameter("id", id).getSingleResult();
    }

    @DELETE
    @Path("crew-members/{id}")
    public void deleteCrewMember(@PathParam("id") int id){
        em.remove(em.find(CrewMemberEntity.class, id));
    }


}
