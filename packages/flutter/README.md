![31c9262e-aeea-4403-9086-3c8b88885cab](https://github.com/hugeicons/hugeicons-react/assets/130147052/ff91f2f0-095a-4c6d-8942-3af4759f9021)


# Free Flutter Icons - Hugeicons

Welcome to Hugeicons Flutter Icons, your premier destination for free Flutter icons. Our expansive collection features over 4,500+ stroke-rounded SVG icons, available at no charge and crafted to meet a diverse array of design requirements. These icons are perfect for devs and designers seeking top-quality, customizable options for enhancing their digital product.

What sets Hugeicons apart is the careful attention to detail—each icon is crafted to be incredibly beautiful and consistent, ensuring that your designs look user-friendly and professional.

Trusted by over 150,000 creatives worldwide, Hugeicons makes it easy to add a wide range of beautiful icons to your Flutter projects without any hassle.

You can preview out our full collection of icons on the [Hugeicons website](https://hugeicons.com/icons).


![a40aa766-1b04-4a2a-a2e6-0ec3c492b96a](https://github.com/hugeicons/hugeicons-react/assets/130147052/f82c0e0e-60ae-4617-802f-812cdc7a58da)


## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Extensive Collection**: Access over 4,500+ stroke-rounded SVG icons for free, ready to use in your projects.
- **SVG-Based**: High-quality vector icons that scale perfectly at any size.
- **Scalable Icons**: Easily adjust the size of icons to fit your design perfectly.
- **Color Customization**: Apply any color to icons to match your brand or design theme.
- **Stroke Width Control**: Customize stroke width for fine-tuned design control.
- **Tree Shaking**: Only include the icons you use in your final app bundle.

## Installation

To install and start using Hugeicons Flutter Icons in your project, follow the steps below:

```dart
dependencies:
  hugeicons: ^1.0.0
```

Then run:

```bash
$ flutter pub get
```

## Usage Examples

To use Hugeicons Flutter Icons in your project, import the package and call the desired icon using the `HugeIcon` widget. You can customize the icon size, color, stroke width, and other properties as needed.

### Basic Usage

```dart
import 'package:hugeicons/hugeicons.dart';

HugeIcon(
  icon: HugeIcons.strokeRoundedHome01,
  color: Colors.red,
  size: 30.0,
),
```

### With Custom Stroke Width

```dart
HugeIcon(
  icon: HugeIcons.strokeRoundedAirplaneSeat,
  color: Colors.blue,
  size: 50.0,
  strokeWidth: 2.5, // Custom stroke width
),
```

### Available Icons

All icons follow the naming pattern: `HugeIcons.strokeRounded[IconName]`

Examples:
- `HugeIcons.strokeRoundedHome01`
- `HugeIcons.strokeRoundedAirplaneSeat`
- `HugeIcons.strokeRoundedUser`
- `HugeIcons.strokeRoundedSettings`

## Contributing

We welcome contributions from the community to help improve Hugeicons Flutter Icons. If you have any suggestions, feedback, or ideas for new icons, please feel free to submit a pull request or open an issue on our GitHub repository.

## License

Hugeicons Flutter Icons is licensed under the MIT License. You are free to use, modify, and distribute the icons for personal and commercial projects. We appreciate attribution to Hugeicons when using our icons in your projects.

## License

Hugeicons Flutter Icons is licensed under the MIT License. This permits use, modification, distribution, and private or commercial use of the flutter icons, provided only the icons that the original copyright and permission notice are included in all copies or substantial portions of the software.

For more details, see the [LICENSE](./LICENSE) file in the repository.
