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
}
