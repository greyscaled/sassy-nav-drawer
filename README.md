[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/fuck-it-ship-it.svg)](https://forthebadge.com)
# Sassy Nav Drawer
A Navigation Drawer and menu built entirely with CSS and without any additional
vendor stylesheets or icon fonts.

## About
This project is an iteration of a weekly effort called **Code Something Weekly** whereby I try to explore topics for learning purposes each week.

Read about [C.S Weekly here](https://medium.com/@vapurrmaid/code-something-weekly-how-and-why-44640d279ca1).

![DEMO](https://i.imgur.com/rmIpYNG.gif)

## Installation

```bash
npm run install
```

### Building
```bash
npm run build
```

Deploying to a local server on port 3000:
```bash
npm run start
```

## Development
```bash
npm run dev
```
Will start `node-sass` in watch mode and start a local server on port 3000. As things are currently set, you have to manually refresh the page to see updates.

## Tutorial

>**Note:** Basic familiarity with SCSS is assumed.

There are a few major topics that this project explores:
- [Checkbox Inputs and Labels](#inputs-and-labels)
- [SCSS Scaffold](#scss-skeleton)
- [Using Pseudo classes](#styling-the-hamburger-with-before-and-after)
- [leveraging SCSS Variabes](#using-variables)
- [:checked and Sibling Selectors](#checked-and-sibling-selectors)
- [Selecing Drawer States](#selecting-drawer-states)

### Menu Icon
The menu icon uses a few 'tricks':
- an invisible `<input type="checkbox">`
- A label
- `::before, ::after` pseudo classes

I've set up a [codepen](https://codepen.io/vapurrmaid/pen/ejbRww) with the code for the menu icon for reference and tinkering away.

#### Inputs and Labels
A normal checkbox `<input>` has exactly two states
- `:checked`
- `:not(:checked)`

which makes it a good candidate for toggling an entity. Furthermore, **clicking on the associated `<label>` toggles the value**. To be quickly convinced of this, check out the [MDN page](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox).

Let's start off with an input and label:

```html
<div class="navigation">
  <input class="navigation__cbox" id="DrawerToggle" type="checkbox"/>
  <label class="navigation__hamburger-box" for="DrawerToggle">
  </label>
</div>
```
It's worth noting here that labels are just inline elements. There is nothing special about them other than the `for` attribute which binds them to an `input` with a matching id.

Let's add another inline element that we'll use to form the hamburger: `<span>`. The final markup and all that's needed to make a hamburger is:

```html
<div class="navigation">
  <input class="navigation__cbox" id="DrawerToggle" type="checkbox"/>
  <label class="navigation__hamburger-box" for="DrawerToggle">
    <span class="navigation__hamburger"/>
  </label>
</div>
```

#### SCSS Skeleton
Start with a navigation class skeleton:
>In case you're unfamiliar with the `__` notation, it's [BEM](http://getbem.com/introduction/). We'll see shortly how nicely this plays with SCSS nesting. The `&` just copies the current level. For example, if we're currently inside `.bob`, then `&__turner` selects `".bob__turner"`

```scss
.navigation {
  &__cbox {
  }
  
  &__hamburger-box {
  }
  
  &__hamburger {
  }
}
```

Lets get the easy stuff out of the way:
- To hide the check box, use `display: none;`
- Give the hamburger box a z-index and desired position (we'll do top left corner). Make sure it has a height and width defined:
```scss
&__cbox { display: none; }
&__hamburger-box {
    width: 4rem;
    height: 4rem;
    
    position: absolute;
    top: 3rem;
    left: 3rem;
    
    cursor: pointer;
    text-align: center;
    z-index: 1000;
}
```

#### Styling the Hamburger with ::before and ::after
The `::before` and `::after` pseudo classes might seem mysterious at first, but they're really not too bad once you start to play with them.

As the names imply, `::before` adds content before the selected element and `::after` after the selected element.

Here's a simple example that changes bullet points to '💅' and adds '✨' after
```html
<ul>
  <li>sassy</li>
  <li>sassy</li>
  <li>boi</li>
</ul>

<style>
ul { list-style:none; }
li::before { content: "💅 "; }
li::after { content: "✨"; }
</style>
```

In the case of our hamburger, we don't want to insert text content but rather we'll style the pseudo elements as lines. However, without defining `content`, the elements don't render (as they are empty). To get around this, we use an empty string: `content: "";`.

You can read more about this on the [MDN content property](https://developer.mozilla.org/en-US/docs/Web/CSS/content) page.

The first line we position is actually *the middle* line (otherwise the (vegan) paddy of the burger). Give it a margin relative to the hamburger box in order to position it. We don't want to use absolute position as we will see shortly. Be careful what values you use here, they have to match up with the hamburger box height:


```scss
margin-top: 2rem; /* 50% of 4rem */
```

Additionally, we're going to way to set position to `relative` so that we can **adjust the position of the pseudo elements relative to this middle line**:

```scss
&__hamburger {
  margin-top: 2rem;
  position: relative;
  
  // rest of code goes below here
}
```

Next let's give all 3 lines the same style:
```scss
&,
&::before,
&::after {
  // same hamburger-box width
  width: 4rem;
  height: 2px;
  
  // make sure each is its own line
  display: block;
  
  background-color: #FFF;
}
```

Positioning the `::before` and `::after` lines is just a matter of absolute positioning now. But be careful, as I stated prior **we need to make sure we set the `content` property, even though it's an empty string**. Failure to do so will cause the browser to not rendered them as they're considered empty and the properties we're defining are just the background box.

```scss
&::before,
&::after {
  content: "";
  position: absolute;
}

&::before { top: -2rem; }
&::after { top: 2rem; }
```

> **Note:** Notice that the top are `2rem` each. That's because we set the hamburger box
> height to `4rem` and the middle line at `2/4 rem`. Be careful of these sizes - using variables and `calc` can help manage everything as we'll see in the next section.

#### Using Variables
Since the height and positioning are all related, let's define a single variable that can be used as a basis for calculation.

```scss
$hamburger-height: 4rem;

.navigation {
  &__cbox { display: none; }
  &__hamburger-box {
    width: $hamburger-height;
    height: $hamburger-height;
    
    position: absolute;
    top: 3rem;
    left: 3rem;
    
    cursor: pointer;
    text-align: center;
    z-index: 1000;
  }
  
  &__hamburger {
    margin-top: calc(#{$hamburger-height} * .5);
    position: relative;
    
    &,
    &::before,
    &::after {
      width: $hamburger-height;
      height: 2px;
      
      display: block;
      background-color: #FFF;
    }
    
    &::before,
    &::after {
      content: "";
      position: absolute;
    }
    
    &::before {
      top: calc(#{$hamburger-height} * -.5);
    }
    &::after {
      top: calc(#{$hamburger-height} * .5);
    }
  }
}
```

To re-iterate, all of this is in a [codepen](https://codepen.io/vapurrmaid/pen/ejbRww) if you'd like to tinker.
### Opening And Closing The Drawer

Alright, we've got a hamburger menu. Now how do we react to it?

#### Checked and Sibling Selectors
The state of the `<input>` is determined by the following selectors:
`:checked` and `:not(:checked)`

Therefore if we combine the `:checked` selector with a selector for an element that should react, we can toggle its behaviour!

But how might we combine those selectors?

It's highly unlikely that the classes you want to toggle will be children of the checkbox. Therefore we have to leverage the sibling selectors `+` and `~` which as stated on MDN do the following:

>The adjacent sibling combinator (+) separates two selectors and matches the second element only if it immediately follows the first element, and both are children of the same parent element.

>The general sibling combinator (~) separates two selectors and matches the second element only if it follows the first element (though not necessarily immediately), and both are children of the same parent element.

In both cases, it's important that everything is a *child of the same parent*.

That's why we put everything within the `.navigation` div:

```
<div class="navigation">
  <input="navigation__cbox"/>
  ...
  <nav class="navigation_nav">
</div>
```

#### Selecting Drawer States
Putting everything together, let's initially define the navigation drawer as hidden. I opted to set its opacity, position and width, although this can be done in various ways. 

Then, change those property when selecting with `:checked` and general sibling `~`:

```scss
$drawer-width: 80vw;

.navigation {
    &__nav {
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1000;
        
        // this hides the navigation drawer
        opacity: 0;
        width: 0;
        transform: translateX(calc(#{$drawer-width} * -1));
    }
    
    &__btn:checked ~ &__nav {
      opacity: 1;
      width: $drawer-width;
      transform: translateX(0);
    }
}
```

For a slide effect, simply add a `transition` property in `__nav`:

```scss
transition: all .5s ease-in-out;
```

Furthermore, to make it look on top of everything, I'd suggest adding a box-shadow:

```scss
box-shadow: 1rem 0 1rem rgba($color-black, .15);
```

Thanks for reading!
