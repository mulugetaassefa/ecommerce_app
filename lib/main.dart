import 'package:ecommerce/constants/global_variables.dart';
import 'package:ecommerce/providers/user_provider.dart';
import  'package:ecommerce/router.dart';
import 'package:ecommerce/features/auth/screens/auth_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
 
void main() {
  runApp(MultiProvider(providers:[ 
    ChangeNotifierProvider(
      create:(context) =>UserProvider(),
    ),
   ], child:const MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Amazon Clone',
      theme: ThemeData(
       scaffoldBackgroundColor: GlobalVariables.backgroundColor,
       colorScheme:  const ColorScheme.light( 
        primary: GlobalVariables.secondaryColor,
       ),
       appBarTheme: const AppBarTheme( 
        elevation: 0,
        iconTheme: IconThemeData(  
          color: Colors.black,
        )
       )
      ),
     onGenerateRoute: (settings) => generateRoutes(settings),
      home: const AuthScreen(),
    );
  }
}

