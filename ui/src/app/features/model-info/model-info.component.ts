/*
 * Copyright (c) 2020 the original author or authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Model } from 'src/app/data/interfaces/model';
import { ModelInfoFacade } from './model-info.facade';

@Component({
  selector: 'model-info',
  templateUrl: './model-info.component.html',
  styleUrls: ['./model-info.component.scss'],
})
export class ModelInfoComponent implements OnInit, OnDestroy {
  currentModel: Model;
  currentModelSubs: Subscription;

  constructor(private modelInfoFacade: ModelInfoFacade, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const modelId = this.route.snapshot.queryParams.model;
    const app = this.route.snapshot.queryParams.app;

    this.modelInfoFacade.loadTotalImagesInfo(app);
    this.currentModelSubs = this.modelInfoFacade.currentModel$
      .pipe(
        filter(model => !!model),
        map(models => models.find(model => model.id === modelId)),
        tap(model => (this.currentModel = model))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.currentModelSubs.unsubscribe();
  }
}
