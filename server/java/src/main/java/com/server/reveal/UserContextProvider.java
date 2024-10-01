package com.server.reveal;

import com.infragistics.reveal.sdk.api.IRVUserContext;
import com.infragistics.reveal.sdk.base.RVUserContext;
import com.infragistics.reveal.sdk.rest.RVContainerRequestAwareUserContextProvider;
import java.util.HashMap;
import jakarta.ws.rs.container.ContainerRequestContext;

public class UserContextProvider extends RVContainerRequestAwareUserContextProvider {
    @Override
    protected IRVUserContext getUserContext(ContainerRequestContext requestContext) {
		String xHeaderOneValue = requestContext.getHeaderString("x-header-one");
		System.out.println("xHeaderOneValue: " + xHeaderOneValue);
		String userId = (xHeaderOneValue != null) ? xHeaderOneValue : "<NOT SET>";	
		System.out.println("userId: " + userId);
		var props = new HashMap<String, Object>();
		props.put("some-property", "some-value");
		return new RVUserContext(userId, props); 
    }
}