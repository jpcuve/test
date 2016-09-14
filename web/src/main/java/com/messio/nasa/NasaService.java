package com.messio.nasa;

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
public class NasaService {
    private static final Logger LOGGER = Logger.getLogger(NasaService.class.getCanonicalName());

    @PersistenceContext
    private EntityManager em;

    @GET
    @Path("mission-names")
    public List<String> getMissionNames(){
        return em.createNamedQuery(MissionEntity.MISSION_NAMES, String.class).getResultList();
    }

    @GET
    @Path("crew-member-names")
    public List<String> getCrewMemberNames(){
        return em.createNamedQuery(CrewMemberEntity.CREW_MEMBER_NAMES, String.class).getResultList();
    }

    @GET
    @Path("missions")
    public List<MissionEntity> getMissions(){
        return em.createQuery("select distinct m from MissionEntity m left join fetch m.crewMemberIds", MissionEntity.class).getResultList();
    }

    @GET
    @Path("crew-members")
    public List<CrewMemberEntity> getCrewMembers(){
        return em.createQuery("select distinct cm from CrewMemberEntity cm left join fetch cm.missionIds", CrewMemberEntity.class).getResultList();
    }
}
