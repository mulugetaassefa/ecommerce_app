
import 'dart:convert';

import 'package:ecommerce/constants/error_handling.dart';
import 'package:ecommerce/constants/global_variables.dart';
import 'package:ecommerce/constants/utlis.dart';
 import 'package:ecommerce/features/home/screens/home_screen.dart';
import 'package:ecommerce/modeles/user.dart';
import 'package:ecommerce/providers/user_provider.dart';
import 'package:provider/provider.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  // sign up user
  void signUpUser({
   required BuildContext context,
    required String email,
    required String password,
    required String name,
  })  
    async { 
    try {
      User user = User (
         id: '',
        name:name,
       email: email,
       password:password,
        address:'',
        type:'',
         token: '',
         );
         http.Response res = await http.post(
          Uri.parse('$uri/api/signup'), 
         body: user.toJson(),
         headers:<String, String>{
          'Content-Type': 'aplication/json; charset=UTF-8',
         },
         );
    if(context.mounted)  {   
    httpErrorHandle(
      response: res, 
      context: context, 
      onSuccess: () {
        showSnackBar(
        context,
        'Account created! Lgin with the same credentials',
        );
      }
      );
    }
    } catch(e){ 
         if(context.mounted) { 
        showSnackBar(context, e.toString());
         }
       
    }
}
// sign in user
  void signInUser({
   required BuildContext context,
    required String email,
    required String password,
   
  })  
    async { 
    try {
         http.Response res = await http.post(
          Uri.parse('$uri/api/signin'), 
         body:jsonEncode({
          'email':email,
          'password':password,
         }),
         headers:<String, String>{
          'Content-Type': 'aplication/json; charset=UTF-8',
         },
         );
    if(context.mounted)  {   
    httpErrorHandle (
      response: res, 
      context: context, 
      onSuccess: () async {

      SharedPreferences prefs =await SharedPreferences.getInstance();
         if (context.mounted) {
        Provider.of<UserProvider>(context, listen: false).setUser(res.body);
       }
  
      await prefs.setString('x-auth-token', jsonDecode(res.body)['token']);
     if (context.mounted) { 
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const HomeScreen()),
          (route) => false
          );
     }
     }
      

      );
    }
    } catch(e) { 
         if(context.mounted) { 
        showSnackBar(context, e.toString());
         }
       
    }
}
}