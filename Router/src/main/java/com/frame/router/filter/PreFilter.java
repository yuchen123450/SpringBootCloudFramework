/**
 * @author: Chen
 * @date:   Sep 30, 2019
 */
package com.frame.router.filter;

import javax.servlet.http.HttpServletRequest;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

/**
 * @author Chen
 * @date   Sep 30, 2019
 * @description PreFilter.java	
 */
public class PreFilter extends ZuulFilter{
	@Override
	public int filterOrder() {
		return 0; // run before PreDecoration
	}

	@Override
	public String filterType() {
		return "pre";
	}

	@Override
	public boolean shouldFilter() {
		RequestContext ctx = RequestContext.getCurrentContext();
//		return !ctx.containsKey("forward_id") 		// a filter has already forwarded
//				&& !ctx.containsKey("service_id"); 	// a filter has already determined serviceId
//		return false;
		System.out.println("pre filter triggered");
		return true;
	}
//    @Override
//    public Object run() {
//        RequestContext ctx = RequestContext.getCurrentContext();
//		HttpServletRequest request = ctx.getRequest();
//		if (request.getParameter("sample") != null) {
//		    // put the serviceId in `RequestContext`
//    		ctx.put("service_id", request.getParameter("foo"));
//    	}
//        return null;
//    }

	@Override
	public Object run() {
		RequestContext ctx = RequestContext.getCurrentContext();
		HttpServletRequest request = ctx.getRequest();

		System.out.println(
				"Request Method : " + request.getMethod() + " Request URL : " + request.getRequestURL().toString());
		System.out.println(request.getHeader("token"));
		return null;
	}
}
