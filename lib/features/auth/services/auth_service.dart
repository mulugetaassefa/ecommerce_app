import 'dart:convert';
//import 'dart:html';
import 'package:ecommerce/common/widgets/buttom_bar.dart';
import 'package:ecommerce/constants/error_handling.dart';
import 'package:ecommerce/constants/global_variables.dart';
import 'package:ecommerce/constants/utlis.dart';
import 'package:ecommerce/models/user.dart';
import 'package:ecommerce/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  // sign up user
  void signUpUser({
    required BuildContext context,
    required String email,
    required String password,
    required String name,
  }) async {
    try {
      User user = User(
        id: '',
        name: name,
        password: password,
        email: email,
        address: '',
        type: '',
        token: '',
        cart: [],
      );
       final Map<String, String> headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
    final Map<String, String> body = {
        'name':user.name,
        'email': user.email,
         'password': user.password,
    };
     final jsonBody = jsonEncode(body);

      http.Response  res = await http.post(
        Uri.parse(register),
         headers:headers,
        body:jsonBody);

  if(context.mounted) {
      httpErrorHandle(
        response: res,
        context: context,
        onSuccess: () {
          showSnackBar(
            context,
            'Account created! Login with the same credentials!',
          );
        },
      );
  }
    } catch (e) {
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
  }) async {
    try {
  
     final Map<String, String> headers = {
      'Content-Type': 'application/json; charset=UTF-8'
     };

      final Map<String, String> body = {
        'email':email,
         'password':password,
    };

     final jsonBody = jsonEncode(body);
        http.Response  res = await http.post(
        Uri.parse(login),
         headers:headers,
        body: jsonBody);

      if(context.mounted) { 
      httpErrorHandle(
        response: res,
        context: context,
        onSuccess: () async {
          SharedPreferences prefs = await SharedPreferences.getInstance();
          if(context.mounted) { 
          Provider.of<UserProvider>(context, listen: false).setUser(res.body);
          }
          await prefs.setString('x-auth-token', jsonDecode(res.body)['token']);
         if (context.mounted) {
              Navigator.pushNamedAndRemoveUntil(
            context,
            BottomBar.routeName,
            (route) => false,
           );
       }
        }
      );

      }
    } catch (e) {
      if(context.mounted) { 
      showSnackBar(context, e.toString());
      }
    }
  }

  // get user data
  void getUserData(
    BuildContext context,
  ) async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('x-auth-token');

      if (token == null) {
        prefs.setString('x-auth-token', '');
      }

      var tokenRes = await http.post(
        Uri.parse('$uri/tokenIsValid'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'x-auth-token': token!
        },
      );

      var response = jsonDecode(tokenRes.body);

      if (response == true) {
        http.Response userRes = await http.get(
          Uri.parse('$uri/'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'x-auth-token': token
          },
        );
          if(context.mounted) { 
        var userProvider = Provider.of<UserProvider>(context, listen: false);
          
        userProvider.setUser(userRes.body);
          }
      }
    } catch (e) {
      if(context.mounted) { 
      showSnackBar(context, e.toString());
      }
    }
  }
}