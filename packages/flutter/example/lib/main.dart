import 'package:flutter/material.dart';
import 'package:hugeicons/hugeicons.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('HugeIcons Example'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              HugeIcon(
                icon: HugeIcons.strokeRoundedHome01,
                color: Colors.blue,
                size: 50.0,
              ),
              HugeIcon(
                icon: HugeIcons.strokeRoundedAirplaneSeat,
                color: Colors.red,
                size: 100.0,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
