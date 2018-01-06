# F.E.Mock [fe-tooltip](https://www.npmjs.com/package/fe-tooltip)

## Dependencies

+ Angular >=4.0.0 

## Install

You can get it on npm.

```sh
npm install fe-tooltip --save
```

## Usage

app.module.ts:

```ts
import { TooltipModule } from 'fe-tooltip';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        ...
        TooltipModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

You need either set  
demo.html:  

```ts
<label class="form-label">
    <i class="question" tooltip="{{tipMsg}}">?</i>
</label>
```
