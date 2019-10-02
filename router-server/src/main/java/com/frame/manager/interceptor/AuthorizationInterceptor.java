//package com.frame.manager.interceptor;
//
//import java.lang.reflect.Method;
//
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//import org.springframework.web.method.HandlerMethod;
//import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
//
////import com.pdstars.manager.annotation.Authorization;
////import com.pdstars.manager.auth.AuthService;
////import com.pdstars.manager.common.Constants;
////import com.pdstars.manager.common.TokenModel;
////import com.pdstars.manager.enums.SystemCodeEnum;
////import com.pdstars.manager.utils.TokenUtil;
//
///**
// * 自定义拦截器，判断此次请求是否有权限
// * 
// * @see com.pdstars.manager.annotation.Authorization
// * @author ScienJus
// * @date 2015/7/30.
// */
//@Component
//public class AuthorizationInterceptor extends HandlerInterceptorAdapter {
//
//	protected static final Logger logger = LoggerFactory.getLogger(AuthorizationInterceptor.class);
//
////	@Value("${crypto.token.key}")
////	String TOKEN_DES_KEY;
//	
//	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
//			throws Exception {
//		// 如果不是映射到方法直接通过
//		if (!(handler instanceof HandlerMethod)) {
//			return true;
//		}
//		HandlerMethod handlerMethod = (HandlerMethod) handler;
//		Method method = handlerMethod.getMethod();
//		// 从header中得到token
//		String token = request.getHeader("token");
//		System.out.println("token:  " + token);
//		System.out.println(method.toString());
//		// 验证token
////		TokenModel model = TokenUtil.getToken(token, TOKEN_DES_KEY);
////		SystemCodeEnum tokenStatus = authService.checkToken(model);
////		if (tokenStatus == SystemCodeEnum.SUCCESS) {
////			// 如果token验证成功，将token对应的用户id存在request中，便于之后注入
////			request.setAttribute(Constants.CURRENT_USER_ID, model.getUserID());
////			return true;
////		}
////		// 如果验证token失败，并且方法注明了Authorization，返回401错误
////		if (method.getAnnotation(Authorization.class) != null) {
////			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
////			return false;
////		}
//		return true;
//	}
//}
