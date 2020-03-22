'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">nexd-api documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-2bb9299cdd2a2eac62314b534f63ef14"' : 'data-target="#xs-controllers-links-module-AppModule-2bb9299cdd2a2eac62314b534f63ef14"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-2bb9299cdd2a2eac62314b534f63ef14"' :
                                            'id="xs-controllers-links-module-AppModule-2bb9299cdd2a2eac62314b534f63ef14"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ArticlesController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ArticlesController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/RequestController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RequestController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ShoppingListController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShoppingListController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-2bb9299cdd2a2eac62314b534f63ef14"' : 'data-target="#xs-injectables-links-module-AppModule-2bb9299cdd2a2eac62314b534f63ef14"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-2bb9299cdd2a2eac62314b534f63ef14"' :
                                        'id="xs-injectables-links-module-AppModule-2bb9299cdd2a2eac62314b534f63ef14"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ArticlesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ArticlesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RequestService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RequestService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ShoppingListService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ShoppingListService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-66755b3039d57e15657927e9951b3cae"' : 'data-target="#xs-controllers-links-module-AuthModule-66755b3039d57e15657927e9951b3cae"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-66755b3039d57e15657927e9951b3cae"' :
                                            'id="xs-controllers-links-module-AuthModule-66755b3039d57e15657927e9951b3cae"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-66755b3039d57e15657927e9951b3cae"' : 'data-target="#xs-injectables-links-module-AuthModule-66755b3039d57e15657927e9951b3cae"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-66755b3039d57e15657927e9951b3cae"' :
                                        'id="xs-injectables-links-module-AuthModule-66755b3039d57e15657927e9951b3cae"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CallModule.html" data-type="entity-link">CallModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-CallModule-a0e4fc23c7bd7d31a40558959739c6cd"' : 'data-target="#xs-controllers-links-module-CallModule-a0e4fc23c7bd7d31a40558959739c6cd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CallModule-a0e4fc23c7bd7d31a40558959739c6cd"' :
                                            'id="xs-controllers-links-module-CallModule-a0e4fc23c7bd7d31a40558959739c6cd"' }>
                                            <li class="link">
                                                <a href="controllers/CallController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CallController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CallModule-a0e4fc23c7bd7d31a40558959739c6cd"' : 'data-target="#xs-injectables-links-module-CallModule-a0e4fc23c7bd7d31a40558959739c6cd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CallModule-a0e4fc23c7bd7d31a40558959739c6cd"' :
                                        'id="xs-injectables-links-module-CallModule-a0e4fc23c7bd7d31a40558959739c6cd"' }>
                                        <li class="link">
                                            <a href="injectables/CallService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CallService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigModule.html" data-type="entity-link">ConfigModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link">DatabaseModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RequestModule.html" data-type="entity-link">RequestModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-RequestModule-34751a8b41b06a515cec3862893cb1b9"' : 'data-target="#xs-controllers-links-module-RequestModule-34751a8b41b06a515cec3862893cb1b9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RequestModule-34751a8b41b06a515cec3862893cb1b9"' :
                                            'id="xs-controllers-links-module-RequestModule-34751a8b41b06a515cec3862893cb1b9"' }>
                                            <li class="link">
                                                <a href="controllers/RequestController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RequestController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RequestModule-34751a8b41b06a515cec3862893cb1b9"' : 'data-target="#xs-injectables-links-module-RequestModule-34751a8b41b06a515cec3862893cb1b9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RequestModule-34751a8b41b06a515cec3862893cb1b9"' :
                                        'id="xs-injectables-links-module-RequestModule-34751a8b41b06a515cec3862893cb1b9"' }>
                                        <li class="link">
                                            <a href="injectables/RequestService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RequestService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ShoppingListModule.html" data-type="entity-link">ShoppingListModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ShoppingListModule-088288591f35c022ca5732fb3f719abd"' : 'data-target="#xs-controllers-links-module-ShoppingListModule-088288591f35c022ca5732fb3f719abd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ShoppingListModule-088288591f35c022ca5732fb3f719abd"' :
                                            'id="xs-controllers-links-module-ShoppingListModule-088288591f35c022ca5732fb3f719abd"' }>
                                            <li class="link">
                                                <a href="controllers/ShoppingListController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShoppingListController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ShoppingListModule-088288591f35c022ca5732fb3f719abd"' : 'data-target="#xs-injectables-links-module-ShoppingListModule-088288591f35c022ca5732fb3f719abd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ShoppingListModule-088288591f35c022ca5732fb3f719abd"' :
                                        'id="xs-injectables-links-module-ShoppingListModule-088288591f35c022ca5732fb3f719abd"' }>
                                        <li class="link">
                                            <a href="injectables/ShoppingListService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ShoppingListService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link">UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-58bde3cd64de3838b86db9da262bc33f"' : 'data-target="#xs-controllers-links-module-UserModule-58bde3cd64de3838b86db9da262bc33f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-58bde3cd64de3838b86db9da262bc33f"' :
                                            'id="xs-controllers-links-module-UserModule-58bde3cd64de3838b86db9da262bc33f"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-58bde3cd64de3838b86db9da262bc33f"' : 'data-target="#xs-injectables-links-module-UserModule-58bde3cd64de3838b86db9da262bc33f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-58bde3cd64de3838b86db9da262bc33f"' :
                                        'id="xs-injectables-links-module-UserModule-58bde3cd64de3838b86db9da262bc33f"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link">UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UsersModule-9dcf846c7253e1b65aec8f9de206ea2f"' : 'data-target="#xs-controllers-links-module-UsersModule-9dcf846c7253e1b65aec8f9de206ea2f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-9dcf846c7253e1b65aec8f9de206ea2f"' :
                                            'id="xs-controllers-links-module-UsersModule-9dcf846c7253e1b65aec8f9de206ea2f"' }>
                                            <li class="link">
                                                <a href="controllers/ArticlesController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ArticlesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UsersModule-9dcf846c7253e1b65aec8f9de206ea2f"' : 'data-target="#xs-injectables-links-module-UsersModule-9dcf846c7253e1b65aec8f9de206ea2f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-9dcf846c7253e1b65aec8f9de206ea2f"' :
                                        'id="xs-injectables-links-module-UsersModule-9dcf846c7253e1b65aec8f9de206ea2f"' }>
                                        <li class="link">
                                            <a href="injectables/ArticlesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ArticlesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AddressModel.html" data-type="entity-link">AddressModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/Article.html" data-type="entity-link">Article</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArticleFillableFields.html" data-type="entity-link">ArticleFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigService.html" data-type="entity-link">ConfigService</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateArticleDto.html" data-type="entity-link">CreateArticleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRequestArticleDto.html" data-type="entity-link">CreateRequestArticleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginPayload.html" data-type="entity-link">LoginPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordTransformer.html" data-type="entity-link">PasswordTransformer</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterPayload.html" data-type="entity-link">RegisterPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/RequestArticle.html" data-type="entity-link">RequestArticle</a>
                            </li>
                            <li class="link">
                                <a href="classes/RequestArticleStatusDto.html" data-type="entity-link">RequestArticleStatusDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RequestEntity.html" data-type="entity-link">RequestEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/RequestFillableFields.html" data-type="entity-link">RequestFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/RequestFillableFields-1.html" data-type="entity-link">RequestFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/RequestFormDto.html" data-type="entity-link">RequestFormDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResponseTokenDto.html" data-type="entity-link">ResponseTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShoppingList.html" data-type="entity-link">ShoppingList</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShoppingListFillableFields.html" data-type="entity-link">ShoppingListFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShoppingListFormDto.html" data-type="entity-link">ShoppingListFormDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShoppingListRequest.html" data-type="entity-link">ShoppingListRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link">UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserFillableFields.html" data-type="entity-link">UserFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserID.html" data-type="entity-link">UserID</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link">JwtAuthGuard</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Article.html" data-type="entity-link">Article</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRequestUser.html" data-type="entity-link">IRequestUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link">JwtPayload</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});