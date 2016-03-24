module.exports = {
  "pages": [
    {
      "pageName": "HomePage",
      "pagePath": "/home",
      "children": [
        {
          "type": "AutoSignIn",
          "props": {
            "data-umyid": "2"
          }
        },
        {
          "variantName": "bookkeper",
          "type": "NavbarCollapsible",
          "props": {
            "inverse": true,
            "fixedTop": false,
            "fluid": true,
            "staticTop": true,
            "branding": {
              "name": "Brand",
              "href": "/"
            },
            "className": "",
            "data-umyid": "3"
          },
          "children": [
            {
              "variantName": "left",
              "type": "Nav",
              "props": {
                "pullRight": false,
                "data-umyid": "4"
              },
              "children": [
                {
                  "type": "NavItemLink",
                  "props": {
                    "to": "/data-grid",
                    "className": "",
                    "data-umyid": "5"
                  },
                  "children": [
                    {
                      "variantName": "Unsaved variant",
                      "type": "span",
                      "props": {
                        "className": "",
                        "data-umyid": "6"
                      },
                      "text": "Data Grid"
                    }
                  ]
                }
              ]
            },
            {
              "variantName": "left",
              "type": "Nav",
              "props": {
                "pullRight": true,
                "data-umyid": "7"
              },
              "children": [
                {
                  "type": "UserProfileNavItemLink",
                  "props": {
                    "routeUserProfile": "/user-profile",
                    "data-umyid": "8"
                  }
                }
              ]
            }
          ]
        },
        {
          "type": "h3",
          "props": {
            "style": {
              "padding": "1em",
              "textAlign": "center"
            },
            "data-umyid": "9"
          },
          "children": [
            {
              "type": "span",
              "text": "Home Page",
              "props": {
                "data-umyid": "10"
              }
            }
          ]
        },
        {
          "variantName": "2 colums",
          "type": "Grid",
          "props": {
            "fluid": true,
            "data-umyid": "11"
          },
          "children": [
            {
              "type": "Row",
              "children": [
                {
                  "type": "Col",
                  "props": {
                    "xs": 3,
                    "md": 3,
                    "sm": 3,
                    "lg": 3,
                    "data-umyid": "13"
                  },
                  "children": []
                },
                {
                  "type": "Col",
                  "props": {
                    "xs": 6,
                    "md": 6,
                    "sm": 6,
                    "lg": 6,
                    "data-umyid": "14"
                  },
                  "children": [
                    {
                      "type": "Panel",
                      "props": {
                        "data-umyid": "15",
                        "bsStyle": "warning",
                        "header": "Please note"
                      },
                      "children": [
                        {
                          "type": "p",
                          "children": [
                            {
                              "type": "span",
                              "text": "Before you start composing UI, please start Spring Data REST service in order to allow the generators to obtain metadata of the service. Run command from project directory: ",
                              "props": {
                                "data-umyid": "17"
                              },
                              "componentName": null
                            },
                            {
                              "variantName": "Unsaved variant",
                              "type": "strong",
                              "props": {
                                "data-umyid": "18"
                              },
                              "text": "server/build-server.bsh && server/server.bsh start"
                            }
                          ],
                          "props": {
                            "data-umyid": "16"
                          }
                        },
                        {
                          "type": "p",
                          "children": [
                            {
                              "type": "span",
                              "text": "Current project has already implemented an authentication mechanism for Spring Data REST service and it works for data aware components, which you can generate here, as well. Also there are already implemented components which can provide authentication. So, to prevent denying access to data for components please make authentication in live preview mode and use default user account - login: \"user\", password: \"password\"",
                              "props": {
                                "data-umyid": "20"
                              },
                              "componentName": null
                            }
                          ],
                          "props": {
                            "data-umyid": "19"
                          }
                        },
                        {
                          "variantName": "Unsaved variant",
                          "type": "p",
                          "props": {
                            "data-umyid": "21"
                          },
                          "children": [
                            {
                              "type": "span",
                              "text": "\"Project info panel\" (ProjectInfoPanel) component will indicate if the service is running or user account is authenticated successfully.",
                              "props": {
                                "data-umyid": "22"
                              }
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "ProjectInfoPanel",
                      "props": {
                        "data-umyid": "23"
                      },
                      "children": []
                    }
                  ]
                },
                {
                  "type": "Col",
                  "props": {
                    "xs": 3,
                    "md": 3,
                    "sm": 3,
                    "lg": 3,
                    "data-umyid": "24"
                  },
                  "children": []
                }
              ],
              "props": {
                "data-umyid": "12"
              }
            }
          ]
        }
      ],
      "props": {
        "data-umyid": "1"
      },
      "pageTitle": "UnnamedPage2",
      "pageProps": [],
      "pageScript": ""
    },
    {
      "pageName": "UserProfilePage",
      "pagePath": "/user-profile",
      "children": [
        {
          "variantName": "bookkeper",
          "type": "NavbarCollapsible",
          "props": {
            "inverse": true,
            "fixedTop": false,
            "fluid": true,
            "staticTop": true,
            "branding": {
              "name": "Brand",
              "href": "/"
            },
            "data-umyid": "26"
          },
          "children": [
            {
              "variantName": "left",
              "type": "Nav",
              "props": {
                "pullRight": false,
                "data-umyid": "27"
              },
              "children": [
                {
                  "type": "NavItemLink",
                  "props": {
                    "to": "/home",
                    "className": "",
                    "data-umyid": "28"
                  },
                  "children": [
                    {
                      "variantName": "Unsaved variant",
                      "type": "span",
                      "props": {
                        "className": "",
                        "data-umyid": "29"
                      },
                      "text": "Home"
                    }
                  ]
                },
                {
                  "type": "NavItemLink",
                  "props": {
                    "to": "/data-grid",
                    "data-umyid": "30"
                  },
                  "children": [
                    {
                      "variantName": "Unsaved variant",
                      "type": "span",
                      "props": {
                        "className": "",
                        "data-umyid": "31"
                      },
                      "text": "Datagrid"
                    }
                  ]
                }
              ]
            },
            {
              "variantName": "left",
              "type": "Nav",
              "props": {
                "pullRight": true,
                "data-umyid": "32"
              },
              "children": []
            }
          ]
        },
        {
          "type": "AutoSignIn",
          "props": {
            "data-umyid": "33"
          }
        },
        {
          "variantName": "2 colums",
          "type": "Grid",
          "props": {
            "fluid": true,
            "style": {
              "marginTop": "50px"
            },
            "data-umyid": "34"
          },
          "children": [
            {
              "type": "Row",
              "children": [
                {
                  "type": "Col",
                  "props": {
                    "xs": 12,
                    "md": 4,
                    "sm": 8,
                    "lg": 4,
                    "mdOffset": 4,
                    "lgOffset": 4,
                    "smOffset": 2,
                    "data-umyid": "36"
                  },
                  "children": [
                    {
                      "type": "SignInOutForm",
                      "props": {
                        "routeAfterSignIn": "/home",
                        "routeAfterSignOut": "/home",
                        "data-umyid": "37"
                      }
                    }
                  ]
                }
              ],
              "props": {
                "data-umyid": "35"
              }
            }
          ]
        }
      ],
      "props": {
        "data-umyid": "25"
      },
      "pageTitle": "UnnamedPage2",
      "pageProps": [],
      "pageScript": ""
    },
    {
      "pageName": "TemplatePage",
      "pagePath": "/template",
      "children": [
        {
          "type": "AutoSignIn",
          "props": {
            "className": "",
            "data-umyid": "39"
          }
        },
        {
          "variantName": "bookkeper",
          "type": "NavbarCollapsible",
          "props": {
            "inverse": true,
            "fixedTop": false,
            "fluid": true,
            "staticTop": true,
            "branding": {
              "name": "Brand",
              "href": "/"
            },
            "className": "",
            "data-umyid": "40"
          },
          "children": [
            {
              "variantName": "left",
              "type": "Nav",
              "props": {
                "pullRight": false,
                "data-umyid": "41"
              },
              "children": [
                {
                  "type": "NavItemLink",
                  "props": {
                    "to": "/home",
                    "data-umyid": "42"
                  },
                  "children": [
                    {
                      "variantName": "Unsaved variant",
                      "type": "span",
                      "props": {
                        "className": "",
                        "data-umyid": "43"
                      },
                      "text": "Home"
                    }
                  ]
                }
              ]
            },
            {
              "variantName": "left",
              "type": "Nav",
              "props": {
                "pullRight": true,
                "data-umyid": "44"
              },
              "children": [
                {
                  "type": "UserProfileNavItemLink",
                  "props": {
                    "routeUserProfile": "/user-profile",
                    "data-umyid": "45"
                  }
                }
              ]
            }
          ]
        },
        {
          "variantName": "Unsaved variant",
          "type": "h3",
          "props": {
            "className": "text-center",
            "data-umyid": "46"
          },
          "children": [
            {
              "type": "span",
              "text": "Spring Data REST",
              "props": {
                "data-umyid": "47"
              }
            }
          ]
        },
        {
          "variantName": "mini mesh",
          "type": "Grid",
          "props": {
            "fluid": true,
            "style": {
              "marginTop": "3em"
            },
            "className": "",
            "data-umyid": "48"
          },
          "children": [
            {
              "type": "Row",
              "children": [
                {
                  "type": "Col",
                  "props": {
                    "xs": 4,
                    "md": 4,
                    "sm": 4,
                    "lg": 4,
                    "data-umyid": "50"
                  },
                  "children": []
                },
                {
                  "type": "Col",
                  "props": {
                    "xs": 8,
                    "md": 8,
                    "sm": 8,
                    "lg": 8,
                    "data-umyid": "51"
                  },
                  "children": []
                }
              ],
              "props": {
                "data-umyid": "49"
              }
            }
          ]
        }
      ],
      "props": {
        "data-umyid": "38"
      },
      "pageTitle": "UnnamedPage2",
      "pageProps": [],
      "pageScript": ""
    },
    {
      "pageName": "DepartmentsPage",
      "pagePath": "/departments",
      "children": [
        {
          "type": "AutoSignIn",
          "props": {
            "className": "",
            "data-umyid": "53"
          }
        },
        {
          "variantName": "bookkeper",
          "type": "NavbarCollapsible",
          "props": {
            "inverse": true,
            "fixedTop": false,
            "fluid": true,
            "staticTop": true,
            "branding": {
              "name": "Brand",
              "href": "/"
            },
            "className": "",
            "data-umyid": "54"
          },
          "children": [
            {
              "variantName": "left",
              "type": "Nav",
              "props": {
                "pullRight": false,
                "data-umyid": "55"
              },
              "children": [
                {
                  "type": "NavItemLink",
                  "props": {
                    "to": "/home",
                    "data-umyid": "56"
                  },
                  "children": [
                    {
                      "variantName": "Unsaved variant",
                      "type": "span",
                      "props": {
                        "className": "",
                        "data-umyid": "57"
                      },
                      "text": "Home"
                    }
                  ]
                }
              ]
            },
            {
              "variantName": "left",
              "type": "Nav",
              "props": {
                "pullRight": true,
                "data-umyid": "58"
              },
              "children": [
                {
                  "type": "UserProfileNavItemLink",
                  "props": {
                    "routeUserProfile": "/user-profile",
                    "data-umyid": "59"
                  }
                }
              ]
            }
          ]
        },
        {
          "variantName": "Unsaved variant",
          "type": "h3",
          "props": {
            "className": "text-center",
            "data-umyid": "60"
          },
          "children": [
            {
              "type": "span",
              "text": "Departments",
              "props": {
                "data-umyid": "61"
              }
            }
          ]
        },
        {
          "variantName": "mini mesh",
          "type": "Grid",
          "props": {
            "fluid": true,
            "style": {
              "marginTop": "3em"
            },
            "className": "",
            "data-umyid": "62"
          },
          "children": [
            {
              "type": "Row",
              "children": [
                {
                  "type": "Col",
                  "props": {
                    "xs": 4,
                    "md": 4,
                    "sm": 4,
                    "lg": 4,
                    "data-umyid": "64"
                  },
                  "children": [
                    {
                      "variantName": "Unsaved variant",
                      "type": "div",
                      "props": {
                        "data-umyid": "65"
                      },
                      "children": [
                        {
                          "type": "span",
                          "text": "Empty div",
                          "props": {
                            "data-umyid": "66"
                          }
                        }
                      ]
                    },
                    {
                      "variantName": "Unsaved variant",
                      "type": "div",
                      "props": {
                        "data-umyid": "67"
                      },
                      "children": [
                        {
                          "type": "span",
                          "text": "Empty div",
                          "props": {
                            "data-umyid": "68"
                          }
                        }
                      ]
                    },
                    {
                      "variantName": "Unsaved variant",
                      "type": "div",
                      "props": {
                        "data-umyid": "69"
                      },
                      "children": [
                        {
                          "type": "span",
                          "text": "Empty div",
                          "props": {
                            "data-umyid": "70"
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "Col",
                  "props": {
                    "xs": 8,
                    "md": 8,
                    "sm": 8,
                    "lg": 8,
                    "data-umyid": "71"
                  },
                  "children": [
                    {
                      "variantName": "Unsaved variant",
                      "type": "DepartmentsDataGrid",
                      "props": {
                        "data-umyid": "72"
                      },
                      "children": []
                    }
                  ]
                }
              ],
              "props": {
                "data-umyid": "63"
              }
            }
          ]
        }
      ],
      "props": {
        "data-umyid": "52"
      },
      "pageTitle": "UnnamedPage2",
      "pageProps": [],
      "pageScript": ""
    },
    {
      "pageName": "UnnamedPage4",
      "pagePath": "/UnnamedPage4",
      "children": [
        {
          "type": "Panel",
          "props": {
            "data-umyid": "74"
          },
          "children": [
            {
              "type": "p",
              "children": [
                {
                  "type": "span",
                  "text": "Basic panel",
                  "props": {
                    "data-umyid": "76"
                  },
                  "componentName": null
                }
              ],
              "props": {
                "data-umyid": "75"
              }
            },
            {
              "type": "p",
              "children": [
                {
                  "type": "span",
                  "text": "Basic panel",
                  "props": {
                    "data-umyid": "88"
                  },
                  "componentName": null
                }
              ],
              "props": {
                "data-umyid": "87"
              }
            },
            {
              "type": "p",
              "children": [
                {
                  "type": "span",
                  "text": "Basic panel",
                  "props": {
                    "data-umyid": "90"
                  },
                  "componentName": null
                }
              ],
              "props": {
                "data-umyid": "89"
              }
            }
          ]
        },
        {
          "type": "Panel",
          "props": {
            "data-umyid": "77"
          },
          "children": [
            {
              "type": "Input",
              "props": {
                "type": "text",
                "placeholder": "Enter value",
                "addonBefore": "$",
                "buttonAfter": {
                  "type": "Button",
                  "props": {
                    "bsStyle": "default",
                    "data-umyid": "79"
                  },
                  "children": [
                    {
                      "type": "span",
                      "text": "Default",
                      "props": {
                        "data-umyid": "80"
                      }
                    }
                  ]
                },
                "data-umyid": "78",
                "className": ""
              },
              "children": []
            }
          ]
        },
        {
          "type": "Panel",
          "props": {
            "data-umyid": "81"
          },
          "children": [
            {
              "type": "p",
              "children": [
                {
                  "type": "span",
                  "text": "Basic panel",
                  "props": {
                    "data-umyid": "83"
                  },
                  "componentName": null
                }
              ],
              "props": {
                "data-umyid": "82"
              }
            },
            {
              "type": "Input",
              "props": {
                "type": "text",
                "placeholder": "Enter value",
                "addonBefore": "$",
                "buttonAfter": {
                  "type": "Button",
                  "props": {
                    "bsStyle": "default",
                    "data-umyid": "85"
                  },
                  "children": [
                    {
                      "type": "span",
                      "text": "Default",
                      "props": {
                        "data-umyid": "86"
                      }
                    }
                  ]
                },
                "data-umyid": "84"
              },
              "children": []
            }
          ]
        }
      ],
      "props": {
        "data-umyid": "73"
      }
    }
  ]
};
