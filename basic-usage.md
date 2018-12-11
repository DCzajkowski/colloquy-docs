# Using in auto-mode with annotations

## Step 1. Create a class implementing IdentifierResolverInterface

Colloquy needs to distinguish contexts of each type from each other.
That's why under the hood it creates a context with given identifier.
You can think of the 'identifier' as unique name of a save in a game.
When you stop playing you save the game under certain name. When you come back you load save with the same name.
Of course, if you share a computer with anyone, you don't want your save to be the same as theirs, so you come up
with a name that is unique among all other saves on your computer.

Colloquy does the same. Following the above analogy context binding is a computer. Context's identifier
is a name of the game-save. To distinguish between users Colloquy gives the power to the programmer to compute
an identifier.

The identifier can be a _user id_, _session id_, _computer ip_ etc.

Example: Store data per session and identify contexts via a session id.
```php
<?php

namespace App;

use Colloquy\IdentifierResolverInterface;

class SessionIdentifierResolver implements IdentifierResolverInterface
{
    /**
     * Get a unique string that identifies a context. In this case, it returns
     * a session id. Context will be preserved for the session duration.
     * A controller instance is passed in to provide flexibility.
     *
     * @param  mixed $controller A controller instance
     * @return string
     */
    public function get($controller): string
    {
        return session_id();
    }
}
```

## Step 2. Create a new context type

To create a new context type, you have to invoke a `::bind` method.

Every context should have:

- a unique name,
- instance of an identifier resolver,
- instance of a driver.

Currently, Colloquy supports two drivers: `FileDriver` and `MemoryDriver`.
You can create your own [custom driver](/creating-custom-driver.md). It

Example: Creating a session context
```php
<?php

use Colloquy\Colloquy;
use App\SessionIdentifierResolver;
use Colloquy\Drivers\FileDriver;

Colloquy::bind(
    'session',
    new SessionIdentifierResolver,
    new FileDriver($pathToWritableDirectory = __DIR__ . '/storage/contexts')
);
```

## Step 3. Use annotations

Colloquy introduces four types of annotations:

- `@ColloquyContext(CONTEXT_NAME)` - **required, one**

Tells Colloquy which context type to use. Every property of this class with `@ColloquyPersist` will be
automatically preserved and injected.

- `@ColloquyPersist` - **required, at least one**

Tells Colloquy which property to autosave. By default, a key under which a value is saved is
derrived from the property name you can change that by explicitly providing a key:

```php
<?php

class Controller
{
    /** @ColloquyPersist('custom-identifier-goes-here') */
    private $user;
}
```

- `@ColloquyBegin`  - **required, at least one**

Annotation `@ColloquyBegin` above a method begins a new context. It can be used
for example on the first step of a form. Properties annotated with `@ColloquyPersist`
will be automatically saved and restored.

- `@ColloquyEnd`  - **optional, at least one**

After method annotated with `@ColloquyEnd` is executed a context associated with current class will be removed.

::: danger Warning
Due to the limitations, every method that uses a Colloquy annotation and/or uses
auto-injected variables must be declared `private` or `protected`.

If you would like to omit this limitation you can read about [the manual use](#manual-use).
:::


Example: Use in a controller

```php
<?php

namespace App\Models;

class User
{
   public $name;
}
```

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Colloquy\ColloquyContexts;

/** @ColloquyContext('session') */
class FormController
{
    use ColloquyContexts;

    /** @ColloquyPersist */
    protected $user;

    /** @ColloquyBegin */
    private function step1()
    {
        $this->user = new User;
    }

    private function step2()
    {
        $this->user->name = 'John';
    }

    /** @ColloquyEnd */
    private function step3()
    {
        echo $this->user->name; // John
    }
}
```

In this example methods `step1`, `step2` and `step3` are called by different requests.
State is automatically injected and is preserved between requests.

## Manual Use

:::tip
Manual use may provide developers with better control over code and actions performed by Colloquy.
However, we still recommend using annotations as they are convenient and easy to use.
:::

```php
<?php

use Colloquy\Colloquy;
use Colloquy\Drivers\FileDriver;

class User
{
   private $name;

   public function __construct(string $name)
   {
       $this->name = $name;
   }
}

/** Starting a Conversation */

$wrapper = new Colloquy(new FileDriver('path/to/the/storage/directory'));

$homeContext = $wrapper->context('Home');
$formContext = $wrapper->context('Form');

/** Primitive types */

$homeContext->add('Joe', 'name');
$homeContext->add('ilovecats', 'password');
$formContext->add('Jane', 'name');

$name = $homeContext->get('name'); // Joe

$homeContext->set('John', 'name');

$name = $homeContext->get('name'); // John

/** Objects */

$user = new User('Jack');

$homeContext->add($user, 'user');

var_dump($user); // User { name: "Jack" }

$user = $homeContext->get('user');

var_dump($user); // User { name: "Jack" }

/** Ending a Conversation */

$wrapper->end('Form');
$wrapper->end('Home');
```
